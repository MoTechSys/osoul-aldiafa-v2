"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { WA_NUMBER, WA_DISPLAY } from "@/components/Navbar";
import { BRANCHES } from "@/lib/schema";

const contactMethods = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
      </svg>
    ),
    label: "واتساب",
    value: WA_DISPLAY,
    href: `https://wa.me/${WA_NUMBER}`,
    color: "#25D366",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "اتصل بنا",
    value: WA_DISPLAY,
    href: `tel:+${WA_NUMBER}`,
    color: "#C5A059",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: "البريد الإلكتروني",
    value: "info@asoulaldiafa.com",
    href: "mailto:info@asoulaldiafa.com",
    color: "#C5A059",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    label: "تغطيتنا",
    value: "كامل المملكة العربية السعودية",
    href: "#coverage",
    color: "#C5A059",
  },
];

export default function ContactClient() {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", service: "", date: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `السلام عليكم، أنا ${formData.name}
📱 ${formData.phone}
📧 ${formData.email || "غير محدد"}
🎯 الخدمة: ${formData.service || "غير محدد"}
📅 التاريخ: ${formData.date || "غير محدد"}
💬 ${formData.message}`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, rgba(37,211,102,0.2), rgba(37,211,102,0.05))", border: "2px solid rgba(37,211,102,0.4)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.5" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </motion.div>
          <h2 className="text-pearl mb-3 font-amiri" style={{ fontSize: "1.8rem", fontWeight: 700 }}>شكراً لتواصلك!</h2>
          <p className="text-pearl/55 text-sm mb-6">تم إرسال رسالتك عبر واتساب. سنتواصل معك بأقرب وقت.</p>
          <button onClick={() => setSubmitted(false)} className="ghost-button px-6 py-3 rounded-full text-sm">إرسال رسالة أخرى</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs />

      <section className="relative pt-6 pb-10 px-4 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-vignette)" }} />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-gold-bright mb-3" style={{ fontSize: "0.75rem", letterSpacing: "0.4em" }}>✦ تواصل معنا ✦</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-pearl mb-4 font-amiri" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 700, lineHeight: 1.15 }}>
            نسعد <span className="gold-text">بخدمتكم</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-pearl/65 max-w-xl mx-auto text-sm leading-relaxed">
            احجز عبر واتساب أو اتصل بنا — استشارة مجانية لاختيار باقة الضيافة المناسبة لمناسبتك.
          </motion.p>
        </div>
      </section>

      <section className="px-4 mb-12">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {contactMethods.map((method, i) => (
            <motion.a
              key={method.label}
              href={method.href}
              target={method.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="card-royal p-5 text-center"
            >
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${method.color}1A`, border: `1px solid ${method.color}40`, color: method.color }}>
                {method.icon}
              </div>
              <p className="text-pearl text-sm" style={{ fontWeight: 600 }}>{method.label}</p>
              <p className="text-pearl/45 text-xs mt-1 truncate" dir="ltr">{method.value}</p>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 sm:p-8 rounded-3xl card-royal"
          >
            <h2 className="text-pearl mb-6 font-amiri" style={{ fontSize: "1.4rem", fontWeight: 700 }}>أرسل لنا رسالتك</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-pearl/55 text-xs mb-2">الاسم *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-noir text-pearl text-sm placeholder-pearl/25"
                  style={{ border: "1px solid rgba(212,175,55,0.18)" }}
                  placeholder="اسمك الكريم"
                />
              </div>
              <div>
                <label className="block text-pearl/55 text-xs mb-2">رقم الجوال *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-noir text-pearl text-sm placeholder-pearl/25"
                  style={{ border: "1px solid rgba(212,175,55,0.18)" }}
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-pearl/55 text-xs mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-noir text-pearl text-sm placeholder-pearl/25"
                  style={{ border: "1px solid rgba(212,175,55,0.18)" }}
                  placeholder="email@example.com"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-pearl/55 text-xs mb-2">تاريخ المناسبة</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-noir text-pearl text-sm"
                  style={{ border: "1px solid rgba(212,175,55,0.18)" }}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-pearl/55 text-xs mb-2">نوع الخدمة</label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-noir text-pearl text-sm"
                style={{ border: "1px solid rgba(212,175,55,0.18)" }}
              >
                <option value="">اختر نوع الخدمة</option>
                <option value="صبّابي قهوة">صبّابي قهوة ومباشرين</option>
                <option value="ركن ضيافة">تجهيز ركن ضيافة</option>
                <option value="بوفيه تمر وحلويات">بوفيه تمر وحلويات</option>
                <option value="ضيافة فعالية">ضيافة فعالية / مؤتمر</option>
                <option value="تأجير عدّة">تأجير عدّة تقديم</option>
                <option value="باقة متكاملة">باقة متكاملة</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-pearl/55 text-xs mb-2">رسالتك *</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-noir text-pearl text-sm placeholder-pearl/25 resize-none"
                style={{ border: "1px solid rgba(212,175,55,0.18)" }}
                placeholder="عدد الضيوف، الموقع، وأي تفاصيل تساعدنا في تجهيز عرض دقيق."
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-full text-white"
              style={{ background: "linear-gradient(135deg, #1da851, #25D366)", fontWeight: 700, fontSize: "1rem", boxShadow: "0 6px 25px rgba(37,211,102,0.35)" }}
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
              </svg>
              إرسال عبر واتساب
            </motion.button>
          </motion.form>
        </div>
      </section>

      {/* فروعنا — المواقع الفعلية مع روابط خرائط جوجل */}
      <section id="branches" className="px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <p className="text-gold-bright mb-3" style={{ fontSize: "0.75rem", letterSpacing: "0.4em" }}>✦ فروعنا ✦</p>
            <h2 className="text-pearl font-amiri" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 700 }}>
              مواقعنا
            </h2>
            <p className="text-pearl/55 text-sm mt-3 max-w-lg mx-auto">تفضّل بزيارتنا أو اضغط على الفرع لعرض الموقع على خرائط جوجل.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
            {BRANCHES.map((branch, i) => (
              <motion.a
                key={branch.name}
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group flex items-center gap-4 p-5 rounded-2xl transition-all"
                style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.18)" }}
              >
                <span className="shrink-0 grid place-items-center w-11 h-11 rounded-full" style={{ background: "rgba(212,175,55,0.12)" }} aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </span>
                <span className="flex-1 text-right">
                  <span className="block text-pearl font-amiri" style={{ fontSize: "1.05rem", fontWeight: 700 }}>{branch.addressLocality}</span>
                  <span className="block text-pearl/50 text-xs mt-0.5">{branch.addressRegion}</span>
                </span>
                <span className="shrink-0 text-gold-bright text-xs font-medium opacity-70 group-hover:opacity-100 transition-opacity">الخريطة ←</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section id="coverage" className="px-4 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <p className="text-gold-bright mb-3" style={{ fontSize: "0.75rem", letterSpacing: "0.4em" }}>✦ تغطيتنا ✦</p>
            <h2 className="text-pearl font-amiri" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", fontWeight: 700 }}>
              نخدم كامل المملكة العربية السعودية
            </h2>
            <p className="text-pearl/55 text-sm mt-3 max-w-lg mx-auto">نتنقّل بفريقنا وعدّتنا لأي مدينة أو منطقة — أينما كانت مناسبتك، نحن نصل.</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {["جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الخبر", "الطائف", "أبها", "تبوك", "حائل", "نجران", "جازان", "بريدة", "الأحساء", "وسائر مناطق المملكة"].map((city, i) => (
              <motion.span
                key={city}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="px-4 py-2 rounded-full text-sm"
                style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.18)", color: "rgba(245,239,224,0.7)" }}
              >
                {city}
              </motion.span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
