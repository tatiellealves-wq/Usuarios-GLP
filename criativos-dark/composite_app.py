import sys, numpy as np
from scipy import ndimage
from PIL import Image, ImageDraw, ImageFilter

APP = "/home/user/Usuarios-GLP/public/hero/screen-hoy.webp"

def green_quad(img):
    a = np.asarray(img.convert("RGB")).astype(np.int32)
    r,g,b = a[...,0],a[...,1],a[...,2]
    # chroma green: saturated, uniform — much purer than food greens
    mask = (g > r*1.25) & (g > b*1.20) & (g > 45)
    # keep only the largest connected blob = the phone screen
    lab, n = ndimage.label(mask)
    if n == 0:
        return None, mask
    sizes = ndimage.sum(mask, lab, range(1, n+1))
    biggest = 1 + int(np.argmax(sizes))
    mask = lab == biggest
    ys,xs = np.where(mask)
    if len(xs) < 500:
        return None, mask
    s = xs+ys; d = xs-ys
    tl = (xs[np.argmin(s)], ys[np.argmin(s)])
    br = (xs[np.argmax(s)], ys[np.argmax(s)])
    tr = (xs[np.argmax(d)], ys[np.argmax(d)])
    bl = (xs[np.argmin(d)], ys[np.argmin(d)])
    return [tl,tr,br,bl], mask

def inset(quad, px):
    c = np.mean(quad, axis=0)
    return [tuple((np.array(p) + (c-np.array(p))/np.linalg.norm(c-np.array(p))*px).astype(int)) for p in quad]

def perspective_coeffs(dst, src):
    # returns coeffs mapping OUTPUT(dst) -> INPUT(src) for PIL Image.transform
    A=[]; B=[]
    for (x,y),(u,v) in zip(dst,src):
        A.append([x,y,1,0,0,0,-u*x,-u*y]); B.append(u)
        A.append([0,0,0,x,y,1,-v*x,-v*y]); B.append(v)
    A=np.array(A,dtype=float); B=np.array(B,dtype=float)
    res = np.linalg.solve(A,B)
    return res.tolist()

def composite(src_png, out_png):
    base = Image.open(src_png).convert("RGB")
    W,H = base.size
    quad, mask = green_quad(base)
    if quad is None:
        print(src_png, "NO GREEN"); return
    print(src_png, "quad", quad)
    app = Image.open(APP).convert("RGB")
    aw,ah = app.size
    appc = [(0,0),(aw,0),(aw,ah),(0,ah)]  # TL,TR,BR,BL
    coeffs = perspective_coeffs(quad, appc)
    warped = app.transform((W,H), Image.PERSPECTIVE, coeffs, Image.BICUBIC)
    # alpha = filled quad polygon, inset slightly, feathered
    qi = inset(quad, 4)
    m = Image.new("L",(W,H),0)
    ImageDraw.Draw(m).polygon([tuple(p) for p in qi], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(1.2))
    base.paste(warped, (0,0), m)
    base.save(out_png)
    print("saved", out_png)

for src,out in [
    ("_src-02-mecanismo.png","_comp-02-mecanismo.png"),
    ("_src-04-oferta.png","_comp-04-oferta.png"),
    ("_src-06-objecion.png","_comp-06-objecion.png"),
]:
    composite(src,out)
