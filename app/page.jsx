import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import clsx from "clsx";
import { ClobbrAppLogo } from "@/components/clobbr-app-logo";
import { CrontapAppLogo } from "@/components/crontap-app-logo";
import { NextAppLogo } from "@/components/next-app-logo";

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
            href="https://clobbr.app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              <ClobbrAppLogo />
              Clobbr <span>-&gt;</span>
            </h2>
            <p>The app & CLI tool to test API endpoint speed.</p>
          </a>

          <a
            href="https://crontap.com"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              <CrontapAppLogo />
              Crontap <span>-&gt;</span>
            </h2>
            <p>
              Schedule recurring API calls using cron or huamn-readable syntax.
            </p>
          </a>

          <a
            href="https://apihustle.com"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              <NextAppLogo />
              Apihustle <span>-&gt;</span>
            </h2>
            <p>
              A collection of tools to test, improve and get to know your API
              inside and out.
            </p>
          </a>
        </div>

        <div className={styles.grid}>
          <a
            href="https://shipixen.com"
            className={[styles.card, styles.cardRowTwo].join(" ")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Shipixen <span>-&gt;</span>
            </h2>
            <p>Customized boilerplates in minutes.</p>
          </a>

          <a
            href="https://hunted.space"
            className={[styles.card, styles.cardRowTwo].join(" ")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Hunted.space <span>-&gt;</span>
            </h2>
            <p>Product Hunt statistics and live dashboards.</p>
          </a>

          <a
            href="https://tool.crontap.com/cronjob-debugger/multiple"
            className={[styles.card, styles.cardRowTwo].join(" ")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              CronTool <span>-&gt;</span>
            </h2>
            <p>Debug & visualize cron expressions.</p>
          </a>
        </div>

        <div className={styles.footer}>
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

          <a
            href="https://twitter.com/shipixen"
            target="_blank"
            rel="noopener noreferrer"
          >
            @shipixen
          </a>

          <a
            href="https://github.com/parsecph"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
        </div>

        <div className={styles.cvr}>Registered in Denmark, DK39296675</div>
      </div>
    </main>
  );
}
