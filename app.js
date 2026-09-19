const photoInput = document.getElementById("photoInput");

const emptyState = document.getElementById("emptyState");
const workspace = document.getElementById("workspace");

const photoGrid = document.getElementById("photoGrid");

const originalSizeElement =
    document.getElementById("originalSize");

const compressedSizeElement =
    document.getElementById("compressedSize");

const savingElement =
    document.getElementById("saving");

const photoCountElement =
    document.getElementById("photoCount");

const selectionText =
    document.getElementById("selectionText");

const changeSelection =
    document.getElementById("changeSelection");

const bottomChangeSelection =
    document.getElementById("bottomChangeSelection");

const compressButton =
    document.getElementById("compressButton");

const progressSection =
    document.getElementById("progressSection");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

const resultSection =
    document.getElementById("resultSection");

const resultText =
    document.getElementById("resultText");

const saveButton =
    document.getElementById("saveButton");

const targetContainer =
    document.getElementById("targetContainer");

const targetSize =
    document.getElementById("targetSize");

const targetOptions =
    document.querySelectorAll(".target-option");

const customTargetContainer =
    document.getElementById("customTargetContainer");

const targetDescription =
    document.getElementById("targetDescription");

const qualityCards =
    document.querySelectorAll(".quality-card");


let selectedFiles = [];

let compressedFiles = [];

let selectedTargetMB = 1;


/* =========================================================
   CONFIGURACIÓN INICIAL
   ========================================================= */

function initializeQualitySelection() {

    const balancedInput =
        document.querySelector(
            'input[name="quality"][value="balanced"]'
        );


    if (!balancedInput) {
        return;
    }


    balancedInput.checked = true;


    qualityCards.forEach(card => {

        const input =
            card.querySelector("input");


        if (input === balancedInput) {

            card.classList.add("selected");

        } else {

            card.classList.remove("selected");

        }

    });


    targetContainer.classList.add("hidden");


    updateTargetDescription();

}


/* =========================================================
   SELECCIÓN DE FOTOS
   ========================================================= */

photoInput.addEventListener(
    "change",
    event => {

        const files =
            Array.from(
                event.target.files || []
            );


        if (files.length === 0) {
            return;
        }


        selectedFiles =
            files;


        compressedFiles =
            [];


        resultSection.classList.add(
            "hidden"
        );


        progressSection.classList.add(
            "hidden"
        );


        progressBar.style.width =
            "0%";


        progressText.textContent =
            `0 / ${selectedFiles.length}`;


        renderSelectedPhotos();

        updateSummary();


        emptyState.classList.add(
            "hidden"
        );


        workspace.classList.remove(
            "hidden"
        );

    }
);


/* =========================================================
   MOSTRAR FOTOS
   ========================================================= */

function renderSelectedPhotos() {

    photoGrid.innerHTML = "";


    selectedFiles.forEach(
        (file, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "photo-item";


            const image =
                document.createElement(
                    "img"
                );


            image.alt =
                `Foto ${index + 1}`;


            image.loading =
                index < 20
                    ? "eager"
                    : "lazy";


            const objectURL =
                URL.createObjectURL(
                    file
                );


            image.src =
                objectURL;


            image.addEventListener(
                "load",
                () => {

                    URL.revokeObjectURL(
                        objectURL
                    );

                },
                {
                    once: true
                }
            );


            const number =
                document.createElement(
                    "span"
                );


            number.className =
                "photo-number";


            number.textContent =
                index + 1;


            item.appendChild(
                image
            );


            item.appendChild(
                number
            );


            photoGrid.appendChild(
                item
            );

        }
    );


    const count =
        selectedFiles.length;


    photoCountElement.textContent =
        `${count} ${
            count === 1
                ? "foto"
                : "fotos"
        }`;


    selectionText.textContent =
        `${count} ${
            count === 1
                ? "foto seleccionada"
                : "fotos seleccionadas"
        }`;

}


/* =========================================================
   RESUMEN
   ========================================================= */

function updateSummary() {

    const totalBytes =
        selectedFiles.reduce(
            (total, file) =>
                total + file.size,
            0
        );


    originalSizeElement.textContent =
        formatMB(totalBytes);


    compressedSizeElement.textContent =
        "0 MB";


    savingElement.textContent =
        "Ahorro: 0 %";

}


/* =========================================================
   CAMBIAR SELECCIÓN
   ========================================================= */

changeSelection.addEventListener(
    "click",
    () => {

        photoInput.click();

    }
);


bottomChangeSelection.addEventListener(
    "click",
    () => {

        photoInput.click();

    }
);


/* =========================================================
   OPCIONES DE COMPRESIÓN
   ========================================================= */

qualityCards.forEach(
    card => {

        const input =
            card.querySelector(
                "input"
            );


        input.addEventListener(
            "change",
            () => {

                if (!input.checked) {
                    return;
                }


                qualityCards.forEach(
                    otherCard => {

                        otherCard.classList.remove(
                            "selected"
                        );

                    }
                );


                card.classList.add(
                    "selected"
                );


                if (
                    input.value ===
                    "target"
                ) {

                    targetContainer.classList.remove(
                        "hidden"
                    );


                    updateTargetDescription();

                } else {

                    targetContainer.classList.add(
                        "hidden"
                    );

                }

            }
        );

    }
);


/* =========================================================
   BOTONES DE TAMAÑO OBJETIVO
   ========================================================= */

targetOptions.forEach(
    option => {

        option.addEventListener(
            "click",
            () => {

                targetOptions.forEach(
                    otherOption => {

                        otherOption.classList.remove(
                            "active"
                        );

                    }
                );


                option.classList.add(
                    "active"
                );


                const size =
                    option.dataset.size;


                if (
                    size ===
                    "custom"
                ) {

                    customTargetContainer.classList.remove(
                        "hidden"
                    );


                    targetSize.focus();


                    selectedTargetMB =
                        Number(
                            targetSize.value
                        ) || 1;

                } else {

                    customTargetContainer.classList.add(
                        "hidden"
                    );


                    selectedTargetMB =
                        Number(size);

                }


                updateTargetDescription();

            }
        );

    }
);


/* =========================================================
   TAMAÑO PERSONALIZADO
   ========================================================= */

targetSize.addEventListener(
    "input",
    () => {

        const value =
            Number(
                targetSize.value
            );


        if (
            Number.isFinite(value) &&
            value > 0
        ) {

            selectedTargetMB =
                value;

        }


        updateTargetDescription();

    }
);


/* =========================================================
   TEXTO DEL TAMAÑO OBJETIVO
   ========================================================= */

function updateTargetDescription() {

    if (
        !targetDescription
    ) {
        return;
    }


    const value =
        Number(
            selectedTargetMB
        );


    if (
        !Number.isFinite(value) ||
        value <= 0
    ) {

        targetDescription.textContent =
            "Introduce un tamaño válido para cada foto.";

        return;

    }


    targetDescription.textContent =
        `Cada foto intentará mantenerse por debajo de ${formatTargetMB(value)}.`;

}


/* =========================================================
   FORMATO DEL TAMAÑO OBJETIVO
   ========================================================= */

function formatTargetMB(
    value
) {

    if (
        Number.isInteger(value)
    ) {

        return `${value} MB`;

    }


    return `${value
        .toFixed(2)
        .replace(/0+$/, "")
        .replace(/\.$/, "")
    } MB`;

}


/* =========================================================
   BOTÓN COMPRIMIR
   ========================================================= */

compressButton.addEventListener(
    "click",
    async () => {

        if (
            selectedFiles.length === 0
        ) {

            return;

        }


        compressButton.disabled =
            true;


        resultSection.classList.add(
            "hidden"
        );


        progressSection.classList.remove(
            "hidden"
        );


        progressBar.style.width =
            "0%";


        progressText.textContent =
            `0 / ${selectedFiles.length}`;


        compressedFiles =
            [];


        const selectedQuality =
            document.querySelector(
                'input[name="quality"]:checked'
            ).value;


        let targetBytes =
            null;


        /* -------------------------------------------------
           TAMAÑO OBJETIVO
           ------------------------------------------------- */

        if (
            selectedQuality ===
            "target"
        ) {

            if (
                !Number.isFinite(
                    selectedTargetMB
                ) ||
                selectedTargetMB <= 0
            ) {

                alert(
                    "Introduce un tamaño objetivo válido."
                );


                compressButton.disabled =
                    false;


                progressSection.classList.add(
                    "hidden"
                );


                return;

            }


            targetBytes =
                selectedTargetMB *
                1024 *
                1024;

        }


        const total =
            selectedFiles.length;


        for (
            let index = 0;
            index < total;
            index++
        ) {

            const file =
                selectedFiles[index];


            try {

                const compressed =
                    await compressImage(
                        file,
                        selectedQuality,
                        targetBytes
                    );


                compressedFiles.push(
                    compressed
                );

            } catch (error) {

                console.error(
                    "Error comprimiendo:",
                    file.name,
                    error
                );


                compressedFiles.push(
                    file
                );

            }


            const progress =
                (
                    (index + 1) /
                    total
                ) * 100;


            progressBar.style.width =
                `${progress}%`;


            progressText.textContent =
                `${index + 1} / ${total}`;


            await nextFrame();

        }


        showCompressionResult();


        compressButton.disabled =
            false;

    }
);


/* =========================================================
   COMPRESIÓN
   ========================================================= */

async function compressImage(
    file,
    qualityMode,
    targetBytes
) {

    if (
        !file.type.startsWith(
            "image/"
        )
    ) {

        return file;

    }


    const image =
        await loadImage(
            file
        );


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        image.naturalWidth;


    canvas.height =
        image.naturalHeight;


    const context =
        canvas.getContext(
            "2d",
            {
                alpha: false
            }
        );


    context.drawImage(
        image,
        0,
        0
    );


    /* -------------------------------------------------
       TAMAÑO OBJETIVO
       ------------------------------------------------- */

    if (
        qualityMode ===
        "target"
    ) {

        return compressToTarget(
            canvas,
            file,
            targetBytes
        );

    }


    /* -------------------------------------------------
       -1 MB
       ------------------------------------------------- */

    if (
        qualityMode ===
        "minus1mb"
    ) {

        const targetMinusOneMB =
            Math.max(
                100 * 1024,
                file.size -
                (
                    1024 *
                    1024
                )
            );


        return compressToTarget(
            canvas,
            file,
            targetMinusOneMB
        );

    }


    /* -------------------------------------------------
       MÁXIMA / EQUILIBRADO
       ------------------------------------------------- */

    const quality =
        getQuality(
            qualityMode
        );


    const blob =
        await canvasToBlob(
            canvas,
            quality
        );


    if (
        blob.size >=
        file.size
    ) {

        return file;

    }


    return createCompressedFile(
        blob,
        file
    );

}


/* =========================================================
   CALIDAD
   ========================================================= */

function getQuality(
    qualityMode
) {

    switch (
        qualityMode
    ) {

        case "maximum":

            return 0.92;


        case "balanced":

            return 0.80;


        default:

            return 0.80;

    }

}


/* =========================================================
   COMPRESIÓN A TAMAÑO OBJETIVO
   ========================================================= */

async function compressToTarget(
    canvas,
    originalFile,
    targetBytes
) {

    if (
        originalFile.size <=
        targetBytes
    ) {

        return originalFile;

    }


    let minimumQuality =
        0.10;


    let maximumQuality =
        1.00;


    let bestBlob =
        null;


    for (
        let attempt = 0;
        attempt < 12;
        attempt++
    ) {

        const quality =
            (
                minimumQuality +
                maximumQuality
            ) / 2;


        const blob =
            await canvasToBlob(
                canvas,
                quality
            );


        if (
            blob.size <=
            targetBytes
        ) {

            bestBlob =
                blob;


            minimumQuality =
                quality;

        } else {

            maximumQuality =
                quality;

        }

    }


    if (!bestBlob) {

        bestBlob =
            await canvasToBlob(
                canvas,
                0.10
            );

    }


    if (
        bestBlob.size >=
        originalFile.size
    ) {

        return originalFile;

    }


    return createCompressedFile(
        bestBlob,
        originalFile
    );

}


/* =========================================================
   CANVAS → BLOB
   ========================================================= */

function canvasToBlob(
    canvas,
    quality
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            canvas.toBlob(
                blob => {

                    if (blob) {

                        resolve(
                            blob
                        );

                    } else {

                        reject(
                            new Error(
                                "No se pudo generar la imagen."
                            )
                        );

                    }

                },
                "image/jpeg",
                quality
            );

        }
    );

}


/* =========================================================
   CREAR ARCHIVO
   ========================================================= */

function createCompressedFile(
    blob,
    originalFile
) {

    const baseName =
        originalFile.name.replace(
            /\.[^/.]+$/,
            ""
        );


    const newName =
        `${baseName}-compressed.jpg`;


    return new File(
        [
            blob
        ],
        newName,
        {
            type:
                "image/jpeg",

            lastModified:
                Date.now()
        }
    );

}


/* =========================================================
   CARGAR IMAGEN
   ========================================================= */

function loadImage(
    file
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const image =
                new Image();


            const objectURL =
                URL.createObjectURL(
                    file
                );


            image.onload =
                () => {

                    URL.revokeObjectURL(
                        objectURL
                    );


                    resolve(
                        image
                    );

                };


            image.onerror =
                () => {

                    URL.revokeObjectURL(
                        objectURL
                    );


                    reject(
                        new Error(
                            "No se pudo cargar la imagen."
                        )
                    );

                };


            image.src =
                objectURL;

        }
    );

}


/* =========================================================
   RESULTADO
   ========================================================= */

function showCompressionResult() {

    const originalBytes =
        selectedFiles.reduce(
            (
                total,
                file
            ) =>
                total +
                file.size,
            0
        );


    const compressedBytes =
        compressedFiles.reduce(
            (
                total,
                file
            ) =>
                total +
                file.size,
            0
        );


    const savedBytes =
        Math.max(
            0,
            originalBytes -
            compressedBytes
        );


    const savingPercentage =
        originalBytes > 0
            ? Math.round(
                (
                    savedBytes /
                    originalBytes
                ) * 100
            )
            : 0;


    compressedSizeElement.textContent =
        formatMB(
            compressedBytes
        );


    savingElement.textContent =
        `Ahorro: ${savingPercentage} %`;


    resultText.textContent =
        `${formatMB(savedBytes)} ahorrados · ${compressedFiles.length} fotos listas.`;


    resultSection.classList.remove(
        "hidden"
    );

}


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


        if (
            navigator.share &&
            navigator.canShare
        ) {

            try {

                if (
                    navigator.canShare({
                        files:
                            compressedFiles
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


                    return;

                }

            } catch (error) {

                if (
                    error.name ===
                    "AbortError"
                ) {

                    return;

                }

            }

        }


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

    }
);


/* =========================================================
   DESCARGA
   ========================================================= */

function downloadFile(
    file
) {

    const url =
        URL.createObjectURL(
            file
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        file.name;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    setTimeout(
        () => {

            URL.revokeObjectURL(
                url
            );

        },
        1000
    );

}


/* =========================================================
   FORMATO MB
   ========================================================= */

function formatMB(
    bytes
) {

    if (
        bytes <= 0
    ) {

        return "0 MB";

    }


    const megabytes =
        bytes /
        (
            1024 *
            1024
        );


    if (
        megabytes < 0.01
    ) {

        return "<0.01 MB";

    }


    return `${megabytes.toFixed(2)} MB`;

}


/* =========================================================
   UTILIDADES
   ========================================================= */

function sleep(
    milliseconds
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}


function nextFrame() {

    return new Promise(
        resolve => {

            requestAnimationFrame(
                () =>
                    resolve()
            );

        }
    );

}


/* =========================================================
   SERVICE WORKER
   ========================================================= */

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "./service-worker.js"
                )
                .catch(
                    error => {

                        console.error(
                            "No se pudo registrar el Service Worker:",
                            error
                        );

                    }
                );

        }
    );

}


/* =========================================================
   INICIO
   ========================================================= */

initializeQualitySelection();