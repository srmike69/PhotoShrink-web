/* =========================================================
   GUARDAR
   ========================================================= */

saveButton.addEventListener(
    "click",
    async () => {

        if (
            compressedFiles.length === 0
        ) {
            return;
        }


        /*
         * En iPhone utilizamos el menú nativo
         * de compartir.
         *
         * Todas las fotos se envían juntas.
         */

        if (
            navigator.share &&
            navigator.canShare
        ) {

            try {

                if (
                    navigator.canShare({
                        files: compressedFiles
                    })
                ) {

                    await navigator.share({

                        files:
                            compressedFiles,

                        title:
                            "PhotoShrink",

                        text:
                            "Fotos comprimidas"

                    });


                    /*
                     * Si el usuario ha terminado el
                     * proceso correctamente, limpiamos
                     * PhotoShrink para poder seleccionar
                     * otro grupo inmediatamente.
                     */

                    resetPhotoShrink();

                    return;

                }

            } catch (
                error
            ) {

                /*
                 * Si el usuario cancela el menú de iOS
                 * NO borramos las fotos seleccionadas.
                 */

                if (
                    error.name ===
                    "AbortError"
                ) {

                    return;

                }


                console.error(
                    "Error al guardar las fotos:",
                    error
                );


                return;

            }

        }


        /*
         * Fallback para navegadores sin Web Share.
         */

        try {

            for (
                const file of compressedFiles
            ) {

                downloadFile(
                    file
                );


                await sleep(
                    100
                );

            }


            /*
             * Una vez completadas las descargas,
             * limpiamos la selección.
             */

            resetPhotoShrink();

        } catch (
            error
        ) {

            console.error(
                "Error al guardar las fotos:",
                error
            );

        }

    }
);


/* =========================================================
   REINICIAR PHOTOSHRINK
   ========================================================= */

function resetPhotoShrink() {

    /*
     * Limpiar archivos seleccionados.
     */

    selectedFiles =
        [];


    /*
     * Limpiar archivos comprimidos.
     */

    compressedFiles =
        [];


    /*
     * Limpiar las miniaturas.
     */

    photoGrid.innerHTML =
        "";


    /*
     * Restablecer tamaños.
     */

    originalSizeElement.textContent =
        "0 MB";


    compressedSizeElement.textContent =
        "0 MB";


    savingElement.textContent =
        "Ahorro: 0 %";


    /*
     * Restablecer contadores.
     */

    photoCountElement.textContent =
        "0 fotos";


    selectionText.textContent =
        "0 fotos seleccionadas";


    /*
     * Ocultar el progreso y el resultado.
     */

    progressSection.classList.add(
        "hidden"
    );


    resultSection.classList.add(
        "hidden"
    );


    /*
     * Reiniciar barra de progreso.
     */

    progressBar.style.width =
        "0%";


    progressText.textContent =
        "0 / 0";


    /*
     * Volver a la pantalla inicial.
     */

    workspace.classList.add(
        "hidden"
    );


    emptyState.classList.remove(
        "hidden"
    );


    /*
     * Limpiar el input para que iOS permita
     * seleccionar de nuevo las mismas fotos
     * si el usuario quiere hacerlo.
     */

    photoInput.value =
        "";


    /*
     * Llevar la pantalla al principio.
     */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}