import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'


// every time route pathname changes, this component will scroll to the top of the page.
function ScrollToTop() {
    const { pathname } = useLocation()

        useEffect(() => {
            window.scrollTo(0, 0)
        }, [pathname])

        return null
}

export default ScrollToTop