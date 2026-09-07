'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarDays, Clock3, Copy, Mail, MapPin, Music2, Pause, Play, Sparkles, X } from 'lucide-react'

const SIGNOUT_DATE = new Date('2026-09-18T14:00:00')

function getTimeLeft() {
  return Math.max(SIGNOUT_DATE.getTime() - Date.now(), 0)
}

function useCelebrationLoop(audioRef: React.RefObject<HTMLAudioElement | null>) {
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      void audio.play().catch(() => setPlaying(false))
      return
    }

    audio.pause()
    setPlaying(false)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const setAudioPlaying = () => setPlaying(true)
    const setAudioPaused = () => setPlaying(false)
    audio.addEventListener('play', setAudioPlaying)
    audio.addEventListener('pause', setAudioPaused)
    return () => {
      audio.pause()
      audio.removeEventListener('play', setAudioPlaying)
      audio.removeEventListener('pause', setAudioPaused)
    }
  }, [audioRef])

  return { playing, toggle }
}

export default function Page() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [halo, setHalo] = useState({ x: 50, y: 50 })
  const [isScrolled, setIsScrolled] = useState(false)
  const [rsvpOpen, setRsvpOpen] = useState(false)
  const { playing, toggle } = useCelebrationLoop(audioRef)

  useEffect(() => {
    setTimeLeft(getTimeLeft())
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    const move = (event: globalThis.MouseEvent) => setHalo({ x: event.clientX, y: event.clientY })
    const updateScrollProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0
      document.documentElement.style.setProperty('--scroll-progress', `${progress * 100}%`)
      setIsScrolled(window.scrollY > 24)
    }
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14 })
    document.querySelectorAll('.scroll-reveal').forEach((element) => revealObserver.observe(element))
    const openFromHash = () => setRsvpOpen(window.location.hash === '#rsvp')
    window.addEventListener('mousemove', move)
    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    window.addEventListener('hashchange', openFromHash)
    updateScrollProgress()
    openFromHash()
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('scroll', updateScrollProgress)
      window.removeEventListener('hashchange', openFromHash)
      revealObserver.disconnect()
    }
  }, [])

  const openRsvp = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    window.history.replaceState(null, '', '#rsvp')
    setRsvpOpen(true)
  }

  const closeRsvp = () => {
    window.history.replaceState(null, '', window.location.pathname)
    setRsvpOpen(false)
  }

  const countdown = useMemo(() => {
    const safe = Math.max(timeLeft, 0)
    return {
      days: Math.floor(safe / 86400000),
      hours: Math.floor((safe / 3600000) % 24),
      minutes: Math.floor((safe / 60000) % 60),
      seconds: Math.floor((safe / 1000) % 60),
    }
  }, [timeLeft])
  const pad = (value: number) => String(value).padStart(2, '0')

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <audio ref={audioRef} src="/dandelions.mp3" loop preload="metadata" />
      <div className="pointer-halo" style={{ left: halo.x, top: halo.y }} aria-hidden="true" />
      <nav className={`site-nav${isScrolled ? ' is-scrolled' : ''}`}><a href="#top" className="brand"><span className="brand-mark"><Sparkles className="size-4" /></span> O. I. SARAH<span className="brand-year">/ 2026</span></a><div className="nav-links"><a href="#details">Details</a><a href="#story">Moments</a><a href="/catalogue">Catalogue</a><a href="#rsvp" className="nav-cta" onClick={openRsvp}>Send a gift</a></div><button className="music-control" onClick={toggle} aria-label={playing ? 'Pause celebration music' : 'Play celebration music'}>{playing ? <Pause className="size-4" /> : <Music2 className="size-4" />}</button></nav>

      <section id="top" className="hero-section">
        <div className="hero-copy reveal-up"><p className="eyebrow"><span className="eyebrow-dot" /> An invitation to celebrate</p><p className="hero-kicker">SARAH OGBANG</p><h1>She did<br /><em>the thing.</em></h1><p className="hero-subtitle">Faculty of Biological Sciencies<br /><strong>B.Sc University of Calabar</strong></p><p className="class-label">CLASS OF 2026</p><a href="#details" className="hero-link"><span className="hero-link-paint">Stain my white</span><span>↘</span></a></div>
        <div className="hero-visual reveal-up delay-one"><div className="portrait-frame"><img src="/graduation-hero.png" alt="Sarah celebrating her graduation" /></div><div className="hero-stamp">18<br /><span>SEP</span></div><p className="image-caption">A new chapter,<br /><em>beautifully earned.</em></p></div>
      </section>

      <section id="details" className="details-section scroll-reveal"><div className="section-intro"><p className="eyebrow light"><span className="eyebrow-dot" /> Mark your calendar</p><h2>Save<br /><em>the date.</em></h2></div><div className="details-grid"><div className="detail-item"><CalendarDays /><span>DATE</span><strong>18 / 09 / 26</strong><p>Friday afternoon</p></div><div className="detail-item"><Clock3 /><span>SIGN-OUT</span><strong>2:00 PM</strong><p>Guests arrive from 1:30 PM</p></div><div className="detail-item"><MapPin /><span>LOCATION</span><strong>PG room block</strong></div></div></section>

      <section className="countdown-section scroll-reveal"><div><p className="eyebrow"><span className="eyebrow-dot" /> Until the moment</p><h2>The countdown<br /><em>is on.</em></h2></div><div className="countdown-grid">{Object.entries(countdown).map(([label, value]) => <div className="countdown-cell" key={label}><strong>{pad(value)}</strong><span>{label}</span></div>)}</div></section>

      <section id="story" className="story-section scroll-reveal"><div className="story-copy"><p className="eyebrow">The good part</p><h2>Come for the<br /><em>joy.</em> Stay for<br />the memories.</h2><p>Bring your loudest cheer, your camera roll, and a heart ready for a beautiful new beginning.</p><button className="sound-button" onClick={toggle}>{playing ? <Pause className="size-4" /> : <Play className="size-4 fill-current" />} {playing ? 'Pause the mood' : 'Set the mood'}</button></div><div className="story-images"><img className="story-large" src="/graduation-crowd.png" alt="Friends celebrating graduation together" /><img className="story-small" src="/graduation-portrait.png" alt="Graduate holding a diploma" /></div></section>

      <footer id="rsvp" className="site-footer scroll-reveal"><p className="footer-script">With love,<br /><em>the graduating class.</em></p><div><p className="eyebrow">Sarah Ogbang · 2026</p><a className="footer-cta" href="#rsvp" onClick={openRsvp}>RSVP to celebrate <span>↗</span></a></div></footer>

      {rsvpOpen && <div className="modal-backdrop" role="presentation" onClick={closeRsvp}><section className="rsvp-modal" role="dialog" aria-modal="true" aria-labelledby="rsvp-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={closeRsvp} aria-label="Close gift details"><X className="size-5" /></button><p className="eyebrow"><span className="eyebrow-dot" /> A little something</p><h2 id="rsvp-title">Gift<br /><em>Sarah.</em></h2><p className="modal-intro">Your presence is the best gift. If you would like to send something extra, you can use the details below.</p><div className="account-card"><span className="account-label">GIFT / SUPPORT DETAILS</span><strong>Sarah Ogbang</strong><p>OPay · 702 514 0453</p><button className="copy-detail" onClick={() => navigator.clipboard?.writeText('Sarah Ogbang · OPay · 702 514 0453')}><Copy className="size-4" /> Copy details</button></div><a className="modal-mail" href="mailto:ogbangsarah2@gmail.com?subject=A%20gift%20for%20Sarah"><Mail className="size-4" /> Write to Sarah Ogbang <span>↗</span></a></section></div>}
    </main>
  )
}
