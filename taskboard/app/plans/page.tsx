import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Подписки — ZVERTURET",
  description: "Возможности подписок ZVERTURET Pro и Pro+.",
};

export default function PlansPage() {
  return (
    <main className="player-shell plans-shell">
      <aside className="sidebar">
        <Link className="brand" href="/" aria-label="ZVERTURET — главная">
          <Image
            className="brand-mark"
            src="/zverturet-logo.svg"
            alt=""
            width={38}
            height={38}
            priority
          />
          <span>ZVERTURET</span>
        </Link>

        <p className="side-label">Меню</p>
        <Link className="side-link" href="/">
          <span className="nav-icon" aria-hidden="true">♫</span>
          <span>Моя библиотека</span>
        </Link>
        <Link className="side-link" href="/#library">
          <span className="nav-icon" aria-hidden="true">↗</span>
          <span>Хиты 2026</span>
        </Link>
        <Link className="side-link is-active" href="/plans" aria-current="page">
          <span className="nav-icon" aria-hidden="true">✧</span>
          <span>Подписки</span>
        </Link>

        <div className="sidebar-spacer" />
        <div className="local-note">
          <strong>Музыка без границ</strong>
          Выбери план, который подходит твоему ритму.
        </div>
      </aside>

      <section className="main-panel plans-main">
        <header className="topbar">
          <div className="breadcrumb">
            <span className="online-indicator" />
            ZVERTURET <span aria-hidden="true">/</span> ПОДПИСКИ
          </div>
          <Link className="back-link" href="/">
            <span aria-hidden="true">←</span> К плееру
          </Link>
        </header>

        <div className="plans-content">
          <div className="plans-intro">
            <p className="section-eyebrow">Больше свободы</p>
            <h1>Музыка. Только музыка<span className="title-dot">.</span></h1>
            <p className="plans-lead">
              Новые возможности для музыки — без лишнего шума.
            </p>
          </div>

          <div className="plan-grid">
            <article className="plan-card">
              <div className="plan-topline">
                <h2 className="plan-name">ZVERTURET Pro</h2>
                <span className="plan-badge">Pro</span>
              </div>
              <p className="plan-description">Больше музыки, меньше ограничений.</p>
              <ul className="plan-benefits">
                <li>Прослушивание без рекламы</li>
                <li>Высокое качество звука</li>
                <li>Неограниченные плейлисты</li>
              </ul>
              <button className="plan-action" type="button" disabled>
                Скоро
              </button>
            </article>

            <article className="plan-card is-featured">
              <div className="plan-topline">
                <h2 className="plan-name">ZVERTURET Pro+</h2>
                <span className="plan-badge">Pro+</span>
              </div>
              <p className="plan-description">Полное погружение и музыка всегда рядом.</p>
              <ul className="plan-benefits">
                <li>Всё из ZVERTURET Pro</li>
                <li>Lossless-звук</li>
                <li>Офлайн-режим</li>
                <li>Синхронизация устройств</li>
              </ul>
              <button className="plan-action" type="button" disabled>
                Скоро
              </button>
            </article>
          </div>

          <p className="plan-note">
            Тарифы пока представлены как концепция: оформление подписки и эти функции ещё не подключены.
          </p>
        </div>
      </section>
    </main>
  );
}
