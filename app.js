/* =========================================================
   REFERENCIAS DEL DOM
   ========================================================= */

const photoInput =
    document.getElementById("photoInput");

const emptyState =
    document.getElementById("emptyState");

const workspace =
    document.getElementById("workspace");

const photoGrid =
    document.getElementById("photoGrid");

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

const clearSelection =
    document.getElementById("clearSelection");

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

const targetUnit =
    document.getElementById("targetUnit");

const targetOptions =
    document.querySelectorAll(
        ".target-option"
    );

const customTargetContainer =
    document.getElementById(
        "customTargetContainer"
    );

const targetDescription =
    document.getElementById(
        "targetDescription"
    );

const qualityCards =
    document.querySelectorAll(
        ".quality-card"
    );

const preserveMetadata =
    document.getElementById(
        "preserveMetadata"
    );

const preserveFormat =
    document.getElementById(
        "preserveFormat"
    );

const previewSection =
    document.getElementById(
        "previewSection"
    );

const previewButton =
    document.getElementById(
        "previewButton"
    );

const previewContent =
    document.getElementById(
        "previewContent"
    );

const previewOriginal =
    document.getElementById(
        "previewOriginal"
    );

const previewResult =
    document.getElementById(
        "previewResult"
    );

const previewOriginalSize =
    document.getElementById(
        "previewOriginalSize"
    );

const previewResultSize =
    document.getElementById(
        "previewResultSize"
    );

const previewQuality =
    document.getElementById(
        "previewQuality"
    );

const previewResolution =
    document.getElementById(
        "previewResolution"
    );


/* =========================================================
   VARIABLES
   ========================================================= */

let selectedFiles = [];

let compressedFiles = [];

let selectedTargetMB = 1;

let selectedTargetValue = 1;

let selectedTargetUnit = "MB";

let previewObjectURL = null;

let previewOriginalURL = null;

let easterEggClickCount = 0;

let easterEggClickTimer = null;

let easterEggResetTimer = null;

let easterEggMessageTimer = null;


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


        if (
            files.length === 0
        ) {

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

    photoGrid.innerHTML =
        "";


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
            (
                total,
                file
            ) =>
                total +
                file.size,
            0
        );


    originalSizeElement.textContent =
        formatMB(
            totalBytes
        );


    compressedSizeElement.textContent =
        "0 MB";


    savingElement.textContent =
        "Ahorro: 0 %";

}


/* =========================================================
   CAMBIAR SELECCIÓN
   ========================================================= */

if (
    changeSelection
) {

    changeSelection.addEventListener(
        "click",
        () => {

            photoInput.click();

        }
    );

}


if (
    bottomChangeSelection
) {

    bottomChangeSelection.addEventListener(
        "click",
        () => {

            photoInput.click();

        }
    );

}


/* =========================================================
   QUITAR SELECCIÓN
   ========================================================= */

if (
    clearSelection
) {

    clearSelection.addEventListener(
        "click",
        () => {

            resetPhotoShrink();

        }
    );

}


/* =========================================================
   CONFIGURACIÓN INICIAL
   ========================================================= */

function initializeQualitySelection() {

    selectedTargetValue = 1;
    selectedTargetUnit = "MB";
    selectedTargetMB = 1;

    if (targetUnit) {
        targetUnit.value = "MB";
    }

    if (targetContainer) {
        targetContainer.classList.remove("hidden");
    }

    updateTargetDescription();
    showPreviewSection();

}


/* =========================================================
   TAMAÑO OBJETIVO
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


                    selectedTargetValue =
                        Number(
                            targetSize.value
                        ) || 1;


                    selectedTargetUnit =
                        targetUnit
                            ? targetUnit.value
                            : "MB";


                    targetSize.focus();

                } else {

                    customTargetContainer.classList.add(
                        "hidden"
                    );


                    selectedTargetValue =
                        Number(
                            size
                        );


                    selectedTargetUnit =
                        "MB";

                }


                selectedTargetMB =
                    selectedTargetUnit ===
                    "KB"
                        ? selectedTargetValue /
                            1024
                        : selectedTargetValue;


                updateTargetDescription();

                showPreviewSection();

            }
        );

    }
);


/* =========================================================
   TAMAÑO PERSONALIZADO
   ========================================================= */

if (
    targetSize
) {

    targetSize.addEventListener(
        "input",
        updateCustomTarget
    );

}


if (
    targetUnit
) {

    targetUnit.addEventListener(
        "change",
        updateCustomTarget
    );

}


function updateCustomTarget() {

    const value =
        Number(
            targetSize.value
        );


    if (
        Number.isFinite(
            value
        ) &&
        value > 0
    ) {

        selectedTargetValue =
            value;

    }


    selectedTargetUnit =
        targetUnit
            ? targetUnit.value
            : "MB";


    selectedTargetMB =
        selectedTargetUnit ===
        "KB"
            ? selectedTargetValue /
                1024
            : selectedTargetValue;


    updateTargetDescription();

    hidePreviewResult();

}


/* =========================================================
   TEXTO TAMAÑO
   ========================================================= */

function updateTargetDescription() {

    if (
        !targetDescription
    ) {

        return;

    }


    const value =
        Number(
            selectedTargetValue
        );


    if (
        !Number.isFinite(
            value
        ) ||
        value <= 0
    ) {

        targetDescription.textContent =
            "Introduce un tamaño válido para cada foto.";

        return;

    }


    targetDescription.textContent =
        `Cada foto intentará mantenerse por debajo de ${
            formatTargetValue(
                value,
                selectedTargetUnit
            )
        } sin cambiar su resolución.`;

}


function formatTargetValue(
    value,
    unit
) {

    const decimals =
        Number.isInteger(
            value
        )
            ? 0
            : 2;


    return `${value
        .toFixed(
            decimals
        )
        .replace(
            /0+$/,
            ""
        )
        .replace(
            /\.$/,
            ""
        )
    } ${unit}`;

}


function getSelectedTargetBytes() {

    if (
        !Number.isFinite(
            selectedTargetValue
        ) ||
        selectedTargetValue <= 0
    ) {

        return null;

    }


    if (
        selectedTargetUnit ===
        "KB"
    ) {

        return Math.floor(
            selectedTargetValue *
            1024
        );

    }


    return Math.floor(
        selectedTargetValue *
        1024 *
        1024
    );

}


function showPreviewSection() {

    if (
        previewSection
    ) {

        previewSection.classList.remove(
            "hidden"
        );

    }

}


function hidePreviewResult() {

    if (
        previewContent
    ) {

        previewContent.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   BOTÓN COMPRIMIR
   ========================================================= */

compressButton.addEventListener(
    "click",
    async () => {

        if (
            selectedFiles.length ===
            0
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


        const selectedQuality = "target";

        const targetBytes =
            getSelectedTargetBytes();

        if (
            !targetBytes ||
            targetBytes <= 0
        ) {
            alert(
                "Introduce un tamaño objetivo válido."
            );

            compressButton.disabled = false;
            progressSection.classList.add("hidden");
            return;
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

            } catch (
                error
            ) {

                console.error(
                    "Error comprimiendo:",
                    file.name,
                    error
                );


                /*
                 * En modo objetivo NO se debe devolver
                 * una imagen que supere el objetivo.
                 */

                if (
                    selectedQuality ===
                    "target"
                ) {

                    alert(
                        `No se pudo comprimir "${file.name}" sin superar el tamaño objetivo.`
                    );

                    compressedButtonSafeReset();

                    return;

                }


                compressedFiles.push(
                    file
                );

            }


            const progress =
                (
                    (index + 1) /
                    total
                ) *
                100;


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


function compressedButtonSafeReset() {

    compressButton.disabled =
        false;

    progressSection.classList.add(
        "hidden"
    );

    progressBar.style.width =
        "0%";

}


/* =========================================================
   COMPRESIÓN PRINCIPAL
   ========================================================= */

async function compressImage(
    file,
    qualityMode,
    targetBytes
) {

    if (
        !file.type.startsWith("image/")
    ) {
        return file;
    }

    const originalType =
        getImageMimeType(file);

    const image =
        await loadImage(file);

    const originalExif =
        preserveMetadata &&
        preserveMetadata.checked &&
        originalType === "image/jpeg"
            ? await extractExifSegment(file)
            : null;

    return compressToTarget(
        image,
        file,
        targetBytes,
        originalExif,
        originalType
    );

}


/* =========================================================
   DETECTAR HEIC / HEIF
   ========================================================= */

function isHeicFile(
    file
) {

    const type =
        (
            file.type ||
            ""
        ).toLowerCase();


    if (
        type ===
            "image/heic" ||
        type ===
            "image/heif"
    ) {

        return true;

    }


    return /\.(heic|heif)$/i.test(
        file.name
    );

}


/* =========================================================
   DETECTAR FORMATO
   ========================================================= */

function getImageMimeType(
    file
) {

    const type =
        (
            file.type ||
            ""
        ).toLowerCase();


    if (
        type ===
        "image/jpg"
    ) {

        return "image/jpeg";

    }


    if (
        type
    ) {

        return type;

    }


    if (
        /\.jpe?g$/i.test(
            file.name
        )
    ) {

        return "image/jpeg";

    }


    if (
        /\.png$/i.test(
            file.name
        )
    ) {

        return "image/png";

    }


    if (
        /\.webp$/i.test(
            file.name
        )
    ) {

        return "image/webp";

    }


    if (
        /\.(heic|heif)$/i.test(
            file.name
        )
    ) {

        return "image/heic";

    }


    if (
        /\.avif$/i.test(
            file.name
        )
    ) {

        return "image/avif";

    }


    if (
        /\.gif$/i.test(
            file.name
        )
    ) {

        return "image/gif";

    }


    return "image/jpeg";

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
   DETECTAR TRANSPARENCIA
   ========================================================= */

function imageHasTransparency(
    image
) {

    const maxTestSize =
        512;


    const scale =
        Math.min(
            1,
            maxTestSize /
                Math.max(
                    image.naturalWidth,
                    image.naturalHeight
                )
        );


    const width =
        Math.max(
            1,
            Math.round(
                image.naturalWidth *
                scale
            )
        );


    const height =
        Math.max(
            1,
            Math.round(
                image.naturalHeight *
                scale
            )
        );


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        width;

    canvas.height =
        height;


    const context =
        canvas.getContext(
            "2d",
            {
                willReadFrequently:
                    true
            }
        );


    if (
        !context
    ) {

        return false;

    }


    context.clearRect(
        0,
        0,
        width,
        height
    );


    context.drawImage(
        image,
        0,
        0,
        width,
        height
    );


    try {

        const pixels =
            context.getImageData(
                0,
                0,
                width,
                height
            ).data;


        for (
            let index = 3;
            index < pixels.length;
            index += 4
        ) {

            if (
                pixels[index] <
                255
            ) {

                return true;

            }

        }

    } catch (
        error
    ) {

        console.warn(
            "No se pudo comprobar la transparencia:",
            error
        );

    }


    return false;

}


/* =========================================================
   COMPROBAR SOPORTE DE CODIFICACIÓN
   ========================================================= */

async function canEncodeImageType(
    type
) {

    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        2;

    canvas.height =
        2;


    const context =
        canvas.getContext(
            "2d"
        );


    if (
        !context
    ) {

        return false;

    }


    context.fillRect(
        0,
        0,
        2,
        2
    );


    try {

        const blob =
            await canvasToBlob(
                canvas,
                0.80,
                type
            );


        return (
            blob &&
            blob.type ===
                type
        );

    } catch (
        error
    ) {

        return false;

    }

}


/* =========================================================
   COMPRESIÓN A TAMAÑO OBJETIVO
   ========================================================= */

async function compressToTarget(
    image,
    originalFile,
    targetBytes,
    originalExif,
    outputType
) {

    if (
        !targetBytes ||
        targetBytes <= 0
    ) {

        throw new Error(
            "Tamaño objetivo inválido."
        );

    }


    /*
     * Si la original ya está dentro del objetivo,
     * no la recomprimimos.
     */

    if (
        originalFile.size <=
        targetBytes
    ) {

        const originalResult =
            new File(
                [
                    originalFile
                ],
                originalFile.name,
                {
                    type:
                        originalFile.type,

                    lastModified:
                        originalFile.lastModified
                }
            );


        originalResult.__photoShrinkQuality =
            100;


        originalResult.__photoShrinkWidth =
            image.naturalWidth;


        originalResult.__photoShrinkHeight =
            image.naturalHeight;


        return originalResult;

    }


    const originalWidth =
        image.naturalWidth;


    const originalHeight =
        image.naturalHeight;


    /*
     * Calidad mínima: 90 %.
     * Nunca bajamos de este valor.
     */

    const minimumQuality =
        outputType ===
            "image/png"
            ? 1
            : 0.90;


    /*
     * Genera un candidato y añade los metadatos
     * antes de comprobar su tamaño definitivo.
     */

    async function createCandidate(
        scale,
        quality
    ) {

        const width =
            Math.max(
                1,
                Math.round(
                    originalWidth *
                    scale
                )
            );


        const height =
            Math.max(
                1,
                Math.round(
                    originalHeight *
                    scale
                )
            );


        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            width;


        canvas.height =
            height;


        const context =
            canvas.getContext(
                "2d",
                {
                    alpha:
                        outputType !==
                        "image/jpeg"
                }
            );


        if (
            !context
        ) {

            throw new Error(
                "No se pudo crear el canvas."
            );

        }


        if (
            outputType ===
            "image/jpeg"
        ) {

            context.fillStyle =
                "#ffffff";


            context.fillRect(
                0,
                0,
                width,
                height
            );

        }


        context.imageSmoothingEnabled =
            true;


        context.imageSmoothingQuality =
            "high";


        context.drawImage(
            image,
            0,
            0,
            width,
            height
        );


        let blob =
            await canvasToBlob(
                canvas,
                outputType ===
                    "image/png"
                    ? undefined
                    : quality,
                outputType
            );


        /*
         * Los metadatos forman parte del tamaño final.
         */

        if (
            preserveMetadata &&
            preserveMetadata.checked &&
            outputType ===
                "image/jpeg" &&
            originalExif
        ) {

            blob =
                await insertExifIntoJpeg(
                    blob,
                    originalExif
                );

        }


        return {

            blob,

            width,

            height,

            quality:
                outputType ===
                    "image/png"
                    ? 1
                    : quality,

            scale

        };

    }


    /*
     * PNG: la calidad no controla el tamaño.
     * Solo reducimos resolución.
     */

    if (
        outputType ===
        "image/png"
    ) {

        let low =
            0.01;


        let high =
            1;


        const minimumCandidate =
            await createCandidate(
                low,
                1
            );


        if (
            minimumCandidate.blob.size >
            targetBytes
        ) {

            throw new Error(
                "El tamaño objetivo es demasiado pequeño para esta imagen."
            );

        }


        let best =
            minimumCandidate;


        for (
            let attempt = 0;
            attempt < 18;
            attempt++
        ) {

            const scale =
                (
                    low +
                    high
                ) /
                2;


            const candidate =
                await createCandidate(
                    scale,
                    1
                );


            if (
                candidate.blob.size <=
                targetBytes
            ) {

                best =
                    candidate;


                low =
                    scale;

            } else {

                high =
                    scale;

            }

        }


        return createCompressedTargetFile(
            best,
            originalFile,
            targetBytes,
            outputType
        );

    }


    /*
     * JPEG / WEBP
     *
     * Buscamos la combinación que conserve mejor
     * la imagen visualmente sin superar el objetivo.
     *
     * La resolución tiene prioridad sobre bajar
     * la calidad por debajo del 90 %, que está prohibido.
     */

    const scaleCandidates = [

        1.00,
        0.975,
        0.95,
        0.925,
        0.90,
        0.875,
        0.85,
        0.825,
        0.80,
        0.775,
        0.75,
        0.725,
        0.70,
        0.675,
        0.65,
        0.625,
        0.60,
        0.575,
        0.55,
        0.525,
        0.50,
        0.475,
        0.45,
        0.425,
        0.40,
        0.375,
        0.35,
        0.325,
        0.30,
        0.275,
        0.25,
        0.225,
        0.20,
        0.175,
        0.15,
        0.125,
        0.10,
        0.075,
        0.05,
        0.025,
        0.01

    ];


    const qualityCandidates = [

        1.00,
        0.99,
        0.98,
        0.97,
        0.96,
        0.95,
        0.94,
        0.93,
        0.92,
        0.91,
        0.90

    ];


    let best =
        null;


    /*
     * Primero comprobamos si existe una solución
     * manteniendo la resolución original.
     */

    for (
        const quality of
        qualityCandidates
    ) {

        const candidate =
            await createCandidate(
                1,
                quality
            );


        if (
            candidate.blob.size <=
            targetBytes
        ) {

            best =
                candidate;

            break;

        }

    }


    /*
     * Si la resolución original no entra,
     * buscamos la MAYOR resolución posible
     * que permita una calidad de al menos 90 %.
     *
     * Para cada resolución buscamos después
     * la mayor calidad posible.
     */

    if (
        !best
    ) {

        let lowScale =
            0.01;


        let highScale =
            1;


        /*
         * Comprobamos primero que una resolución
         * mínima sea suficiente.
         */

        const minimumCandidate =
            await createCandidate(
                0.01,
                minimumQuality
            );


        if (
            minimumCandidate.blob.size >
            targetBytes
        ) {

            throw new Error(
                "El tamaño objetivo es demasiado pequeño para esta imagen."
            );

        }


        best =
            minimumCandidate;


        /*
         * Búsqueda binaria de resolución.
         *
         * En cada punto usamos 90 % para saber
         * si esa resolución cabe.
         */

        for (
            let attempt = 0;
            attempt < 18;
            attempt++
        ) {

            const scale =
                (
                    lowScale +
                    highScale
                ) /
                2;


            const candidate =
                await createCandidate(
                    scale,
                    minimumQuality
                );


            if (
                candidate.blob.size <=
                targetBytes
            ) {

                best =
                    candidate;


                lowScale =
                    scale;

            } else {

                highScale =
                    scale;

            }

        }


        /*
         * Ahora tenemos la mayor resolución posible
         * aproximadamente.
         *
         * Buscamos la calidad máxima que entre.
         */

        let lowQuality =
            minimumQuality;


        let highQuality =
            1;


        const resolution =
            lowScale;


        const baseCandidate =
            await createCandidate(
                resolution,
                minimumQuality
            );


        if (
            baseCandidate.blob.size <=
            targetBytes
        ) {

            best =
                baseCandidate;

        }


        for (
            let attempt = 0;
            attempt < 18;
            attempt++
        ) {

            const quality =
                (
                    lowQuality +
                    highQuality
                ) /
                2;


            const candidate =
                await createCandidate(
                    resolution,
                    quality
                );


            if (
                candidate.blob.size <=
                targetBytes
            ) {

                best =
                    candidate;


                lowQuality =
                    quality;

            } else {

                highQuality =
                    quality;

            }

        }

    }


    /*
     * Búsqueda fina alrededor de la mejor resolución.
     *
     * Sirve para aprovechar los últimos KB sin
     * sacrificar resolución innecesariamente.
     */

    const bestScale =
        best.scale;


    const fineScales = [

        bestScale * 1.025,
        bestScale * 1.015,
        bestScale * 1.005,
        bestScale,
        bestScale * 0.995,
        bestScale * 0.985,
        bestScale * 0.975

    ]
        .filter(
            scale =>
                scale > 0 &&
                scale <= 1
        );


    for (
        const scale of
        fineScales
    ) {

        let lowQuality =
            minimumQuality;


        let highQuality =
            1;


        /*
         * Primero comprobamos 100 %.
         * Si entra, es automáticamente preferible
         * a bajar calidad.
         */

        const maximumCandidate =
            await createCandidate(
                scale,
                1
            );


        if (
            maximumCandidate.blob.size <=
            targetBytes
        ) {

            if (
                scale >=
                best.scale
            ) {

                best =
                    maximumCandidate;

            }

            continue;

        }


        /*
         * Si 100 % no entra, buscamos la máxima
         * calidad posible sin bajar de 90 %.
         */

        const minimumCandidate =
            await createCandidate(
                scale,
                minimumQuality
            );


        if (
            minimumCandidate.blob.size >
            targetBytes
        ) {

            continue;

        }


        let fineBest =
            minimumCandidate;


        for (
            let attempt = 0;
            attempt < 14;
            attempt++
        ) {

            const quality =
                (
                    lowQuality +
                    highQuality
                ) /
                2;


            const candidate =
                await createCandidate(
                    scale,
                    quality
                );


            if (
                candidate.blob.size <=
                targetBytes
            ) {

                fineBest =
                    candidate;


                lowQuality =
                    quality;

            } else {

                highQuality =
                    quality;

            }

        }


        /*
         * Elegimos primero la resolución más alta.
         * Si la resolución es prácticamente igual,
         * elegimos la mayor calidad.
         */

        const currentPixelCount =
            best.width *
            best.height;


        const candidatePixelCount =
            fineBest.width *
            fineBest.height;


        if (
            candidatePixelCount >
            currentPixelCount
        ) {

            best =
                fineBest;

        } else if (
            candidatePixelCount ===
            currentPixelCount &&
            fineBest.quality >
            best.quality
        ) {

            best =
                fineBest;

        }

    }


    /*
     * Garantía final.
     */

    if (
        !best ||
        best.blob.size >
            targetBytes
    ) {

        throw new Error(
            "No se pudo alcanzar el tamaño objetivo sin superarlo."
        );

    }


    return createCompressedTargetFile(
        best,
        originalFile,
        targetBytes,
        outputType
    );

}


/* =========================================================
   CREAR ARCHIVO DE TAMAÑO OBJETIVO
   ========================================================= */

function createCompressedTargetFile(
    candidate,
    originalFile,
    targetBytes,
    outputType
) {

    if (
        candidate.blob.size >
        targetBytes
    ) {

        throw new Error(
            "El archivo final supera el tamaño objetivo."
        );

    }


    const file =
        createCompressedFile(
            candidate.blob,
            originalFile,
            outputType
        );


    file.__photoShrinkQuality =
        candidate.quality ===
            null
            ? null
            : Math.round(
                candidate.quality *
                100
            );


    file.__photoShrinkWidth =
        candidate.width;


    file.__photoShrinkHeight =
        candidate.height;


    file.__photoShrinkFormat =
        outputType;


    return file;

}


/* =========================================================
   CANVAS → BLOB
   ========================================================= */

function canvasToBlob(
    canvas,
    quality,
    type
) {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            canvas.toBlob(
                blob => {

                    if (
                        blob
                    ) {

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
                type,
                quality
            );

        }
    );

}


/* =========================================================
   EXTRAER EXIF JPEG
   ========================================================= */

async function extractExifSegment(
    file
) {

    if (
        file.type !==
            "image/jpeg" &&
        file.type !==
            "image/jpg" &&
        !/\.jpe?g$/i.test(
            file.name
        )
    ) {

        return null;

    }


    try {

        const buffer =
            await file.arrayBuffer();


        const bytes =
            new Uint8Array(
                buffer
            );


        if (
            bytes[0] !==
                0xFF ||
            bytes[1] !==
                0xD8
        ) {

            return null;

        }


        let offset =
            2;


        while (
            offset + 4 <
            bytes.length
        ) {

            if (
                bytes[offset] !==
                0xFF
            ) {

                offset++;

                continue;

            }


            const marker =
                bytes[
                    offset + 1
                ];


            if (
                marker ===
                0xD9
            ) {

                break;

            }


            if (
                marker ===
                    0xD8 ||
                marker ===
                    0x01
            ) {

                offset +=
                    2;

                continue;

            }


            const length =
                (
                    bytes[
                        offset + 2
                    ] << 8
                ) |
                bytes[
                    offset + 3
                ];


            if (
                length < 2 ||
                offset +
                    2 +
                    length >
                    bytes.length
            ) {

                break;

            }


            if (
                marker ===
                0xE1
            ) {

                const exifStart =
                    offset + 4;


                const exifEnd =
                    offset +
                    2 +
                    length;


                if (
                    exifEnd >
                    exifStart + 6
                ) {

                    const header =
                        new TextDecoder(
                            "ascii"
                        ).decode(
                            bytes.slice(
                                exifStart,
                                exifStart + 6
                            )
                        );


                    if (
                        header ===
                        "Exif\u0000\u0000"
                    ) {

                        return bytes.slice(
                            offset,
                            exifEnd
                        );

                    }

                }

            }


            offset +=
                2 +
                length;

        }

    } catch (
        error
    ) {

        console.warn(
            "No se pudieron leer los EXIF:",
            error
        );

    }


    return null;

}


/* =========================================================
   INSERTAR EXIF EN JPEG
   ========================================================= */

async function insertExifIntoJpeg(
    blob,
    exifSegment
) {

    if (
        !exifSegment
    ) {

        return blob;

    }


    try {

        const newBuffer =
            await blob.arrayBuffer();


        const jpeg =
            new Uint8Array(
                newBuffer
            );


        if (
            jpeg[0] !==
                0xFF ||
            jpeg[1] !==
                0xD8
        ) {

            return blob;

        }


        const output =
            new Uint8Array(
                jpeg.length +
                exifSegment.length
            );


        output[0] =
            jpeg[0];

        output[1] =
            jpeg[1];


        output.set(
            exifSegment,
            2
        );


        output.set(
            jpeg.slice(2),
            2 +
            exifSegment.length
        );


        return new Blob(
            [
                output
            ],
            {
                type:
                    "image/jpeg"
            }
        );

    } catch (
        error
    ) {

        console.warn(
            "No se pudieron conservar los EXIF:",
            error
        );


        return blob;

    }

}


/* =========================================================
   CREAR ARCHIVO COMPRIMIDO
   ========================================================= */

function createCompressedFile(
    blob,
    originalFile,
    outputType
) {

    const extension =
        getExtensionForType(
            outputType
        );


    const baseName =
        originalFile.name.replace(
            /\.[^/.]+$/,
            ""
        );


    const newName =
        `${baseName}-compressed.${extension}`;


    return new File(
        [
            blob
        ],
        newName,
        {
            type:
                outputType,

            lastModified:
                originalFile.lastModified
        }
    );

}


/* =========================================================
   EXTENSIÓN
   ========================================================= */

function getExtensionForType(
    type
) {

    switch (
        type
    ) {

        case "image/png":

            return "png";


        case "image/webp":

            return "webp";


        case "image/jpeg":

        default:

            return "jpg";

    }

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
                ) *
                100
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
            compressedFiles.length ===
            0
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


                    resetPhotoShrink();


                    return;

                }

            } catch (
                error
            ) {

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


        try {

            for (
                const file of
                compressedFiles
            ) {

                downloadFile(
                    file
                );


                await sleep(
                    100
                );

            }


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

    if (
        previewObjectURL
    ) {

        URL.revokeObjectURL(
            previewObjectURL
        );

        previewObjectURL =
            null;

    }


    if (
        previewOriginalURL
    ) {

        URL.revokeObjectURL(
            previewOriginalURL
        );

        previewOriginalURL =
            null;

    }


    if (
        previewContent
    ) {

        previewContent.classList.add(
            "hidden"
        );

    }


    if (
        previewOriginal
    ) {

        previewOriginal.removeAttribute(
            "src"
        );

    }


    if (
        previewResult
    ) {

        previewResult.removeAttribute(
            "src"
        );

    }


    selectedFiles =
        [];


    compressedFiles =
        [];


    photoGrid.innerHTML =
        "";


    originalSizeElement.textContent =
        "0 MB";


    compressedSizeElement.textContent =
        "0 MB";


    savingElement.textContent =
        "Ahorro: 0 %";


    photoCountElement.textContent =
        "0 fotos";


    selectionText.textContent =
        "0 fotos seleccionadas";


    progressSection.classList.add(
        "hidden"
    );


    resultSection.classList.add(
        "hidden"
    );


    progressBar.style.width =
        "0%";


    progressText.textContent =
        "0 / 0";


    workspace.classList.add(
        "hidden"
    );


    emptyState.classList.remove(
        "hidden"
    );


    photoInput.value =
        "";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


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
        megabytes <
        0.01
    ) {

        return "<0.01 MB";

    }


    return `${megabytes.toFixed(2)} MB`;

}


/* =========================================================
   FORMATO BYTES
   ========================================================= */

function formatBytes(
    bytes
) {

    if (
        bytes <
        1024
    ) {

        return `${bytes} B`;

    }


    const kb =
        bytes /
        1024;


    if (
        kb <
        1024
    ) {

        return `${kb.toFixed(1)} KB`;

    }


    const mb =
        kb /
        1024;


    return `${mb.toFixed(2)} MB`;

}


/* =========================================================
   VISTA PREVIA
   ========================================================= */

if (
    previewButton
) {

    previewButton.addEventListener(
        "click",
        async () => {

            if (
                selectedFiles.length ===
                0
            ) {

                return;

            }


            const targetBytes =
                getSelectedTargetBytes();


            if (
                !targetBytes ||
                targetBytes <= 0
            ) {

                return;

            }


            previewButton.disabled =
                true;


            previewButton.textContent =
                "Generando...";


            try {
const originalFile =
    selectedFiles[0];


const image =
    await loadImage(
        originalFile
    );


const originalType =
    getImageMimeType(
        originalFile
    );


const originalExif =
    preserveMetadata &&
    preserveMetadata.checked &&
    originalType ===
        "image/jpeg"
        ? await extractExifSegment(
            originalFile
        )
        : null;


const result =
    await compressToTarget(
        image,
        originalFile,
        targetBytes,
        originalExif,
        originalType
    );


                if (
                    previewObjectURL
                ) {

                    URL.revokeObjectURL(
                        previewObjectURL
                    );

                }


                if (
                    previewOriginalURL
                ) {

                    URL.revokeObjectURL(
                        previewOriginalURL
                    );

                }


                previewObjectURL =
                    URL.createObjectURL(
                        result
                    );


                previewOriginalURL =
                    URL.createObjectURL(
                        originalFile
                    );


                previewOriginal.src =
                    previewOriginalURL;


                previewResult.src =
                    previewObjectURL;


                previewOriginalSize.textContent =
                    formatBytes(
                        originalFile.size
                    );


                previewResultSize.textContent =
                    formatBytes(
                        result.size
                    );


                if (
    result.__photoShrinkQuality === null
) {

    previewQuality.textContent =
        "Sin pérdida";

} else {

    previewQuality.textContent =
        `${
            result.__photoShrinkQuality ??
            100
        } %`;

}


                previewResolution.textContent =
                    `${
                        result.__photoShrinkWidth ||
                        image.naturalWidth
                    } × ${
                        result.__photoShrinkHeight ||
                        image.naturalHeight
                    }`;


                previewContent.classList.remove(
                    "hidden"
                );

            } catch (
                error
            ) {

                console.error(
                    "Error generando la vista previa:",
                    error
                );


                alert(
                    error.message ||
                    "No se pudo generar la vista previa."
                );

            } finally {

                previewButton.disabled =
                    false;


                previewButton.textContent =
                    "Previsualizar";

            }

        }
    );

}


/* =========================================================
   EASTER EGG
   ========================================================= */

function initializeEasterEgg() {

    const brandIcon =
        document.querySelector(
            ".brand-icon"
        );


    const brand =
        document.querySelector(
            ".brand"
        );


    if (
        !brandIcon ||
        !brand
    ) {

        return;

    }


    brandIcon.addEventListener(
        "click",
        () => {

            easterEggClickCount++;


            clearTimeout(
                easterEggClickTimer
            );


            easterEggClickTimer =
                setTimeout(
                    () => {

                        easterEggClickCount =
                            0;

                    },
                    2000
                );


            if (
                easterEggClickCount <
                5
            ) {

                return;

            }


            easterEggClickCount =
                0;


            activateEasterEgg(
                brandIcon,
                brand
            );

        }
    );

}


function activateEasterEgg(
    brandIcon,
    brand
) {

    clearTimeout(
        easterEggResetTimer
    );


    clearTimeout(
        easterEggMessageTimer
    );


    brandIcon.textContent =
        "M";


    brandIcon.classList.add(
        "easter-egg-active"
    );


    let message =
        brand.querySelector(
            ".easter-egg-message"
        );


    if (
        !message
    ) {

        message =
            document.createElement(
                "p"
            );


        message.className =
            "easter-egg-message";


        brand.appendChild(
            message
        );

    }


    message.textContent =
        "Si has encontrado esto, ya sabes el secreto: esta app la hice pensando en ti. Porque, de alguna manera, siempre termino dejando un pedacito de ti en las cosas que hago ❤️";


    message.classList.add(
        "visible"
    );


    easterEggMessageTimer =
        setTimeout(
            () => {

                message.classList.remove(
                    "visible"
                );

            },
            10000
        );


    easterEggResetTimer =
        setTimeout(
            () => {

                brandIcon.textContent =
                    "PS";


                brandIcon.classList.remove(
                    "easter-egg-active"
                );

            },
            20000
        );

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
    "serviceWorker" in
    navigator
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

initializeEasterEgg();
