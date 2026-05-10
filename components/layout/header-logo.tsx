import Image from "next/image";
import { Link } from "@/i18n/navigation";

type HeaderLogoProps = {
  href: "/" | "/home";
  ariaLabel: string;
};

export function HeaderLogo({ href, ariaLabel }: HeaderLogoProps) {
  return (
    <Link
      href={href}
      className="group mr-2 flex shrink-0 items-center outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:mr-3 md:mr-4"
      aria-label={ariaLabel}
    >
      <Image
        src="/brand/header-7.png"
        alt=""
        width={960}
        height={252}
        sizes="(max-width: 640px) 98vw, (max-width: 1024px) 820px, 920px"
        className="h-[42px] w-auto max-w-[min(98vw,960px)] origin-left scale-x-[1.08] object-cover object-left invert transition-opacity duration-200 group-hover:opacity-90 dark:invert-0 sm:h-[46px] sm:scale-x-[1.1] md:h-[50px] md:scale-x-[1.12] lg:h-[54px] lg:scale-x-[1.14]"
        priority
        unoptimized
      />
    </Link>
  );
}
