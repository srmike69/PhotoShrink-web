const CACHE_NAME = "photoshrink-v2";

const STATIC_FILES = [
    "./styles.css",
    "./app.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./icons/icon-512-maskable.png",
    "./icons/apple-touch-icon.png"
];


/* =========================================================
   INSTALL
   ========================================================= */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(
            caches
                .open(CACHE_NAME)
                .then(
                    cache =>
                        cache.addAll(
                            STATIC_FILES
                        )
                )
        );

        self.skipWaiting();

    }
);


/* =========================================================
   ACTIVATE
   ========================================================= */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(
                    keys =>
                        Promise.all(
                            keys
                                .filter(
                                    key =>
                                        key !== CACHE_NAME
                                )
                                .map(
                                    key =>
                                        caches.delete(key)
                                )
                        )
                )
                .then(
                    () =>
                        self.clients.claim()
                )

        );

    }
);


/* =========================================================
   FETCH
   ========================================================= */

self.addEventListener(
    "fetch",
    event => {

        const request =
            event.request;


        /*
         * Para navegaciones HTML NO devolvemos
         * una respuesta cacheada.
         *
         * Safari iOS puede rechazar respuestas
         * cacheadas que originalmente pasaron
         * por una redirección.
         */

        if (
            request.mode === "navigate"
        ) {

            event.respondWith(
                fetch(request).catch(
                    () =>
                        caches.match(
                            "./index.html"
                        )
                )
            );

            return;

        }


        /*
         * Para CSS, JS, manifest e iconos:
         * caché primero, red después.
         */

        event.respondWith(

            caches
                .match(request)
                .then(
                    cachedResponse => {

                        if (
                            cachedResponse
                        ) {

                            return cachedResponse;

                        }


                        return fetch(request)
                            .then(
                                response => {

                                    /*
                                     * No almacenamos respuestas
                                     * redirigidas.
                                     */

                                    if (
                                        !response ||
                                        response.status !== 200 ||
                                        response.redirected
                                    ) {

                                        return response;

                                    }


                                    const responseClone =
                                        response.clone();


                                    caches
                                        .open(CACHE_NAME)
                                        .then(
                                            cache => {

                                                cache.put(
                                                    request,
                                                    responseClone
                                                );

                                            }
                                        );


                                    return response;

                                }
                            );

                    }
                )

        );

    }
);