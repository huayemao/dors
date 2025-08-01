// https://whatwebcando.today/articles/handling-service-worker-updates/

import { once } from "../isomorphic/once"

const swURL = '/sw.js'

const waitForPageToLoad = async () => {
  if (document.readyState === 'loading') {
    return new Promise((resolve) => {
      window.addEventListener('load', resolve, { once: true })
    })
  }
  return Promise.resolve()
}

export interface Options {
  onNeedRefresh: (updateSw: () => void) => void
}
export const registerServiceWorker = once(async (options: Options) => {
  await waitForPageToLoad()

  const { serviceWorker } = navigator
  const registration = await serviceWorker.register(swURL, {
    scope: '/',
  })

  const needsRefresh = (reg: ServiceWorkerRegistration) => {
    const updateSw = () => {
      const { waiting } = reg
      if (waiting) {
        waiting.postMessage({ type: 'skip-waiting' })
      }
    }
    options.onNeedRefresh(updateSw)
  }

if (registration.waiting) {
    needsRefresh(registration)
  }

  let firstLoad = false

  registration.addEventListener('updatefound', () => {
    const { installing } = registration
    if (!installing) {
      return
    }

    // wait until the new Service worker is actually installed (ready to take over)
    installing.addEventListener('statechange', () => {
      if (registration.waiting) {
        if (navigator.serviceWorker.controller) {
          // if there's an existing controller (previous Service Worker), show the prompt
          needsRefresh(registration)
        } else {
          firstLoad = true
        }
      }
    })
  })

  let refreshing = false
  // detect controller change and refresh the page
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (firstLoad) {
      firstLoad = false
      return
    }

    if (!refreshing) {
      window.location.reload()
      refreshing = true
    }
  })
})


