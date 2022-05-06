document.addEventListener("DOMContentLoaded", () => {

    function gallery() {
        function galleryInit(container, containerImage, image, heightRow, margin) {
            const rowheight = heightRow;
            const guttersizer = margin;
            const grid = document.querySelector(container);
            const itemGrid = grid.querySelectorAll(containerImage);
            const itemImage = grid.querySelectorAll(image);

            initMasonry(grid, rowheight, guttersizer, itemGrid, itemImage);

            setTimeout(() => {
                window.addEventListener('resize', () => {
                    initMasonry(grid, rowheight, guttersizer, itemGrid, itemImage);
                });
            }, 500);

        }

        function initMasonry(grid, rowheight, guttersizer, itemGrid, itemImage) {
            const containerWidth = grid.clientWidth;
            const imageWidths = getImageWidths(rowheight, itemImage);
            const rows = divideRows(imageWidths, containerWidth);
            let heights = [];
            fitItemsByWidth(rows, heights, containerWidth, rowheight, guttersizer);
            updateItems(rows, heights, guttersizer, itemGrid);
            updateGridHeight(grid, heights, guttersizer);
        }

        function getImageWidths(rowheight, itemImage) {
            let imageWidths = [];
            itemImage.forEach(element => {
                imageWidths.push(element.naturalWidth * rowheight / element.naturalHeight);

            });
            return imageWidths;
        }

        function divideRows(imageWidths, containerWidth) {
            let rows = [];
            let curRow = 0;
            let rowWidth = 0;
            imageWidths.forEach(item => {
                rowWidth += item;
                if (typeof rows[curRow] == 'undefined') {
                    rows[curRow] = [];
                }
                rows[curRow].push(item);
                if (rowWidth >= containerWidth) {
                    curRow += 1;
                    rowWidth = 0;
                }

            });
            return rows;
        }

        function fitItemsByWidth(rows, heights, containerWidth, heightSizer, gutterSizer) {
            rows.forEach(row => {
                let sumWidth = 0;
                let thresholdRatio = 1.5;
                let rowWidth = containerWidth - gutterSizer * (row.length - 1);
                row.forEach(width => {
                    sumWidth += width;
                });
                let ratio = rowWidth / sumWidth;
                if (ratio < thresholdRatio) {
                    row.forEach((width, curRow) => {
                        width *= ratio;
                        row[curRow] = width;
                    });
                    heights.push(heightSizer * ratio);
                } else {
                    heights.push(heightSizer);
                }
                sumWidth = 0;
                row.forEach(width => {
                    sumWidth += width;
                });
            });
        }

        function updateItems(rows, heights, guttersizer, itemGrid) {
            let curRow = 0;
            let curCol = 0;
            let top = 0;
            let left = 0;
            let width = 0;
            let height = 0;
            itemGrid.forEach(item => {
                if (curCol >= rows[curRow].length) {
                    top += heights[curRow];
                    curRow++;
                    curCol = 0;
                    if (curRow !== 0) {
                        top += guttersizer;
                    }
                    left = 0;
                }
                left += rows[curRow][curCol - 1] ? rows[curRow][curCol - 1] + guttersizer : 0;
                width = rows[curRow][curCol];
                height = heights[curRow];
                item.style.cssText = `top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px; `;
                curCol++;
            });
        }

        function updateGridHeight(grid, heights, guttersizer) {
            let sumHeight = heights.reduce((cur, acc) => {
                return cur + acc + guttersizer;
            }, 0);
            sumHeight -= guttersizer;
            grid.style.cssText = `height: ${sumHeight}px`;
        }
        galleryInit('.portfolio__images', '.portfolio__image', '.portfolio__image img', 350, 10);
    }

    gallery();

    //burger
    function showBurger() {
        let burgerButton = document.querySelector('.header__top-burger');
        let burgerMenu = document.querySelector('.header__top-menu');
        let burgerItem = document.querySelectorAll('.header__top-menu ul li');
        let body = document.body;

        burgerButton.addEventListener('click', () => {
            burgerButton.classList.toggle('burger-active');
            burgerMenu.classList.toggle('menu-active');
            body.classList.toggle('body-burger');

        });

        burgerItem.forEach(item => {
            item.addEventListener('click', () => {
                burgerMenu.classList.remove('menu-active');
                burgerButton.classList.remove('burger-active');
                body.classList.remove('body-burger');
            });
        });

    }

    showBurger();

    //popup
    const modals = () => {
        function bindModal(triggerSelector, modalSelector, closeSelector, closeClickOverlay = true) {
            const trigger = document.querySelectorAll(triggerSelector),
                modal = document.querySelector(modalSelector),
                close = document.querySelector(closeSelector),
                windows = document.querySelectorAll('[data-modal]'),
                scroll = calcScroll();

            trigger.forEach(item => {
                item.addEventListener('click', (e) => {
                    if (e.target) {
                        e.preventDefault();
                    }

                    windows.forEach(item => {
                        item.style.display = 'none';
                    });

                    modal.style.display = "flex";
                    document.body.style.overflow = "block-hidden";
                    document.body.style.marginRight = `${scroll}px`;
                    modal.classList.add('appearance');
                });
            });

            close.addEventListener('click', () => {
                windows.forEach(item => {
                    item.style.display = 'none';
                });

                modal.style.display = "none";
                modal.classList.remove('appearance');
                document.body.style.overflow = "";
                document.body.style.marginRight = `0px`;
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal && closeClickOverlay) {
                    windows.forEach(item => {
                        item.style.display = 'none';
                    });

                    modal.classList.remove('appearance');
                    modal.style.display = "none";
                    document.body.style.overflow = "";
                    document.body.style.marginRight = `0px`;
                }
            });
        }

        function calcScroll() {
            let div = document.createElement('div');

            div.style.width = '50px';
            div.style.height = '50px';
            div.style.overflowY = 'scroll';
            div.style.visibility = 'block-hidden';

            document.body.appendChild(div);
            let scrollWidth = div.offsetWidth - div.clientWidth;
            div.remove();

            return scrollWidth;
        }

        bindModal('[data-popup]', '.popup', '.popup__closed');

    };

    modals();

    function scrollTopMenu() {
        const topMenu = document.querySelector('.header__top');

        let a = 0;

        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset;

            if (scrollTop >= 250) {
                topMenu.classList.add('top-menu-scroll');
                if (scrollTop > a) {
                    topMenu.classList.add('menu-hide');
                    topMenu.classList.remove('menu-show');
                } else {
                    topMenu.classList.remove('menu-hide');
                    topMenu.classList.add('menu-show');
                }
            } else {
                topMenu.classList.remove('top-menu-scroll');
            }

            a = scrollTop;
        });

    }

    scrollTopMenu();


});



