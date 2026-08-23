#!/usr/bin/env python3
"""
مولّد صورة معاينة الروابط (Open Graph) — public/og-image.jpg

التشغيل من مجلد المشروع:
    python3 scripts/make-og.py

⚠️ فائدة تقنية حرجة — لا تُخالفها:
مكتبة PIL في هذه البيئة مبنية بـ raqm (تحقّق: PIL.features.check("raqm"))
أي أنها تُشكّل العربية أصلًا عبر HarfBuzz. ولذلك يجب رسم النص العربي
كما هو مع تمرير direction="rtl", language="ar" إلى draw.text.

استخدام arabic_reshaper + python-bidi هنا يُنتج عكسًا مزدوجًا فيظهر
النص مقلوبًا («الضيافة أصول») — وهذا خطأ حصل فعلًا وكُشف بالفحص
البصري. لا تُعِد إدخالهما.

⚠️ ولا بد من فحص الناتج بالعين بعد كل تعديل: خطأ ترتيب الحروف
العربية لا يُكشف بأي تحقّق برمجي.
"""
from PIL import Image, ImageDraw, ImageFont

W,H = 1200,630
def ar(t): return t

img = Image.new("RGB",(W,H),"#0d0b08")
d = ImageDraw.Draw(img)
# خلفية متدرجة قطرية دافئة
for y in range(H):
    for_x = y/H
    r = int(0x14 + (0x2a-0x14)*for_x*0.55)
    g = int(0x12 + (0x20-0x12)*for_x*0.55)
    b = int(0x10 + (0x14-0x10)*for_x*0.55)
    d.line([(0,y),(W,y)], fill=(r,g,b))

fb = "src/app/_fonts/Tajawal-Bold.ttf"
fr = "src/app/_fonts/Tajawal-Regular.ttf"
f_title = ImageFont.truetype(fb, 104)
f_sub   = ImageFont.truetype(fr, 40)
f_small = ImageFont.truetype(fr, 30)
f_dom   = ImageFont.truetype(fb, 28)

def ctr(txt, font, y, fill):
    t = ar(txt)
    bb = d.textbbox((0,0), t, font=font)
    d.text((W/2, y), t, font=font, fill=fill, anchor="ma", direction="rtl", language="ar")

# إطار ذهبي رقيق
d.rectangle([28,28,W-28,H-28], outline="#C5A059", width=2)
d.rectangle([36,36,W-36,H-36], outline=(197,160,89,90), width=1)

# زخرفة علوية
cy=118
d.line([(W/2-190,cy),(W/2-40,cy)], fill="#C5A059", width=2)
d.line([(W/2+40,cy),(W/2+190,cy)], fill="#C5A059", width=2)
d.ellipse([W/2-9,cy-9,W/2+9,cy+9], outline="#E2C68E", width=2)

ctr("أصول الضيافة", f_title, 168, "#E2C68E")
ctr("قهوجيين وصبابين قهوة وضيافة مناسبات", f_sub, 316, "#F5EFE0")
ctr("جدة · ينبع · مكة المكرمة · المدينة المنورة · بدر", f_small, 390, (245,239,224,200))

# شريط سفلي
d.line([(W/2-260,470),(W/2+260,470)], fill=(197,160,89,120), width=1)
ctr("asoulaldiafa.com", f_dom, 500, "#C5A059")

img.save("public/og-image.jpg","JPEG",quality=90,optimize=True,progressive=True)
img.save("/tmp/og_new.png")
print("saved")
