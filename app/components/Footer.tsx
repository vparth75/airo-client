import Image from "next/image";

export default function Footer() {
  return (
  <footer id="contact" className="border-t border-white/10 bg-black">
  <div className="mx-auto grid w-full max-w-4xl justify-items-center gap-10 px-4 py-16 text-center text-white sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-md bg-white px-2 py-1">
              <Image
                src="/mahindra-university-logo.png"
                alt="Mahindra University logo"
                width={180}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="relative h-12 w-12">
              <Image
                src="/airo-logo.png"
                alt="AIRO logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm text-white/70">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
            Contact
          </h3>
          <p>airo@mahindrauniversity.edu.in</p>
          <p>+91 80731 78344</p>
          <p>+91 93465 66444</p>
          <p>Mahindra University, Hyderabad</p>
        </div>

        <div className="space-y-3 text-sm text-white/70">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">
            Social
          </h3>
          <a
            href="https://www.instagram.com/airo_mu/"
            className="block transition hover:text-[#e31837]"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </div>

      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-white/60">
        © 2026 AIRO. All rights reserved.
      </div>
    </footer>
  );
}
