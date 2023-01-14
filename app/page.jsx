import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import clsx from "clsx";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={clsx(styles.main, inter.className)}>
      <div className={styles.content}>
        <h2 className={styles.subtitle}>
          A software development company crafting delightful web experiences.
        </h2>
      </div>

      <div className={styles.top}>
        <div className={clsx(styles.center, styles.logo)}>
          <div className={styles.logoContainer}>
            <Image
              src="/parse-logo.svg"
              alt="Parse logo"
              width={89.2}
              height={93}
              priority
            />
          </div>
          <h1 className={styles.logotype}>Parse Copenhagen</h1>
        </div>
      </div>

      <div>
        <div className={styles.grid}>
          <a
            href="https://apihustle.com"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Apihustle <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              A collection of tools to test, improve and get to know your API
              inside and out.
            </p>
          </a>

          <a
            href="https://clobbr.app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Clobbr <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              The app & CLI tool to test API endpoint speed.
            </p>
          </a>

          <a
            href="https://crontap.com"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Crontap <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Schedule recurring API calls using cron or huamn-readable syntax.
            </p>
          </a>
        </div>

        <div className={styles.footer}>
          <a
            href="https://github.com/parsecph"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>

          <a
            href="https://twitter.com/apihustletools"
            target="_blank"
            rel="noopener noreferrer"
          >
            @apihustletools
          </a>

          <a
            href="https://twitter.com/clobbrapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            @clobbrapp
          </a>

          <a
            href="https://twitter.com/crontapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            @crontapp
          </a>
        </div>
      </div>
    </main>
  );
}
