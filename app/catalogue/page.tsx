'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Sparkles, X } from 'lucide-react'

const gallery = [
    {
        src: '/IMG-20260907-WA0015.jpg',
        alt: 'Sarah celebrating with friends after graduation',
        label: 'The graduate',
        title: 'A new chapter',
        className: 'catalogue-feature',
        objectPosition: 'center',
    },
    {
        src: '/IMG-20260907-WA0014.jpg',
        alt: 'Friends gathered together at the graduation celebration',
        label: 'The people',
        title: 'The good part',
        className: 'catalogue-wide',
        objectPosition: 'center',
    },
    {
        src: '/IMG-20260907-WA0016.jpg',
        alt: 'Sarah posing in her graduation outfit',
        label: 'The moment',
        title: 'Beautifully earned',
        className: 'catalogue-portrait',
        objectPosition: 'center',
    },
    {
        src: '/IMG-20260907-WA0018.jpg',
        alt: 'Graduation guests smiling for a photo',
        label: 'The proof',
        title: 'Worth the wait',
        className: 'catalogue-standard',
        objectPosition: 'center',
    },
    {
        src: '/IMG-20260907-WA0020.jpg',
        alt: 'A joyful group celebrating the graduate',
        label: 'The Fresher',
        title: 'All here for you',
        className: 'catalogue-standard',
        objectPosition: 'center',
    },
    {
        src: '/sarah01.jpeg',
        alt: 'Sarah smiling during her graduation celebration',
        label: 'The Journey',
        title: 'Could not hide it',
        className: 'catalogue-standard',
        objectPosition: '58% center',
    },
    {
        src: '/image.png',
        alt: 'Sarah smiling during her graduation celebration',
        label: 'The CRAZE',
        title: 'Feeling Funky',
        className: 'catalogue-standard',
        objectPosition: '58% center',
    }
]

export default function CataloguePage() {
    const [activeImage, setActiveImage] = useState<typeof gallery[number] | null>(null)

    useEffect(() => {
        if (!activeImage) return

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setActiveImage(null)
        }

        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', closeOnEscape)
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', closeOnEscape)
        }
    }, [activeImage])

    const openImage = (image: typeof gallery[number]) => setActiveImage(image)

    return (
        <main className="catalogue-page">
            <nav className="catalogue-nav">
                <Link href="/" className="brand"><span className="brand-mark"><Sparkles className="size-4" /></span> THE GRADUATE <span className="brand-year">/ 2026</span></Link>
                <Link href="/" className="catalogue-back"><ArrowLeft className="size-4" /> Back home</Link>
            </nav>

            <header className="catalogue-header">
                <p className="eyebrow"><span className="eyebrow-dot" /> A visual record</p>
                <h1>The<br /><em>catalogue.</em></h1>
                <p>Every frame from a day worth remembering. A small collection of joy, pride, and the people who made it unforgettable.</p>
            </header>

            <section className="catalogue-grid" aria-label="Graduation photo catalogue">
                {gallery.map((image, index) => (
                    <figure className={`catalogue-card ${image.className} catalogue-frame-${index % 6}`} key={`${image.src}-${index}`} role="button" tabIndex={0} onClick={() => openImage(image)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openImage(image) } }} aria-label={`Open ${image.title} image`}>
                        <div className="catalogue-image-wrap"><img src={image.src} alt={image.alt} style={{ objectPosition: image.objectPosition }} /></div>
                        <figcaption><span>{image.label}</span><strong>{image.title}</strong><ArrowUpRight className="size-5" /></figcaption>
                    </figure>
                ))}
            </section>

            <footer className="catalogue-footer"><span>SARAH O. I · CLASS OF 2026</span><Link href="/#rsvp">RSVP to celebrate <ArrowUpRight className="size-4" /></Link></footer>

            {activeImage && <div className="lightbox-backdrop" role="presentation" onClick={() => setActiveImage(null)}><section className="lightbox" role="dialog" aria-modal="true" aria-label={`${activeImage.title} image viewer`} onClick={(event) => event.stopPropagation()}><button className="lightbox-close" type="button" onClick={() => setActiveImage(null)} aria-label="Close image viewer"><X className="size-5" /></button><img src={activeImage.src} alt={activeImage.alt} /><p>{activeImage.label} <span>/</span> {activeImage.title}</p></section></div>}
        </main>
    )
}
