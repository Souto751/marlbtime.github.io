import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const STORAGE_PREFIX = 'marlbtime_scroll:';

function getLocationKey(pathname: string, search: string): string {
  return `${pathname}${search}`;
}

function saveScrollPosition(key: string): void {
  sessionStorage.setItem(STORAGE_PREFIX + key, String(window.scrollY));
}

function getScrollPosition(key: string): number {
  const stored = sessionStorage.getItem(STORAGE_PREFIX + key);
  return stored ? Number.parseInt(stored, 10) : 0;
}

export default function ScrollRestoration() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const previousLocationRef = useRef(location);

  useEffect(() => {
    const previous = previousLocationRef.current;
    const previousKey = getLocationKey(previous.pathname, previous.search);
    const currentKey = getLocationKey(location.pathname, location.search);

    if (previousKey !== currentKey) {
      saveScrollPosition(previousKey);
    }

    const restoreScroll = () => {
      if (navigationType === 'POP') {
        window.scrollTo(0, getScrollPosition(currentKey));
      } else {
        window.scrollTo(0, 0);
      }
    };

    requestAnimationFrame(restoreScroll);

    previousLocationRef.current = location;
  }, [location, navigationType]);

  useEffect(() => {
    const saveCurrent = () => {
      const key = getLocationKey(location.pathname, location.search);
      saveScrollPosition(key);
    };

    window.addEventListener('beforeunload', saveCurrent);
    return () => {
      saveCurrent();
      window.removeEventListener('beforeunload', saveCurrent);
    };
  }, [location.pathname, location.search]);

  return null;
}
