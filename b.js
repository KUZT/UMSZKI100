function displayPage(marker, pageIndex) {
    const pages = Array.from(allPages).filter(p => parseInt(p.getAttribute('data-marker')) == parseInt(marker));
    
    if (pageIndex < 0 || pageIndex >= pages.length) return;
    
    currentMarker = parseInt(marker);
    currentPage = pageIndex;
    
    document.querySelectorAll('.marker').forEach(m => m.classList.remove('active'));
    const markerElements = document.querySelectorAll('.marker');
    if (markerElements[parseInt(marker)]) {
        markerElements[parseInt(marker)].classList.add('active');
    }
    
    const page = pages[pageIndex];
    const mainDiv = document.querySelector('.main');
    const pageContainer = document.querySelector('.Page');
    const markerNum = page.getAttribute('data-marker');
    const pageNum = page.getAttribute('data-page');
    
    const navigationHTML = `
        <div style="text-align: center; padding: 20px; margin-top: 20px;">
            <span id="pageNumber">Fejezet ${markerNum} - Oldal ${pageNum}</span>
        </div>
    `;
    
    mainDiv.style.transition = 'none';
    mainDiv.style.transform = 'scaleX(0)';
    mainDiv.style.transformOrigin = 'left';
    
    setTimeout(() => {
        mainDiv.innerHTML = page.innerHTML + navigationHTML;
        mainDiv.style.transition = 'transform 2.5s ease-in-out';
        mainDiv.style.transform = 'scaleX(1)';
    }, 10);
    
    // Előlapozás: a KÖVETKEZŐ oldal betöltése
    loadNextPage(pageContainer, marker, pageIndex);
}

function loadNextPage(container, marker, currentPageIndex) {
    const pages = Array.from(allPages).filter(p => parseInt(p.getAttribute('data-marker')) == parseInt(marker));
    let nextMarker = marker;
    let nextPageIndex = currentPageIndex + 1;
    
    // Ha az utolsó oldalon vagyunk, a következő fejezetre megy
    if (nextPageIndex >= pages.length) {
        if (parseInt(marker) < 10) {
            nextMarker = parseInt(marker) + 1;
            nextPageIndex = 0;
        } else {
            // Utolsó oldal, nincs következő
            container.style.display = 'none';
            return;
        }
    }
    
    const nextPages = Array.from(allPages).filter(p => parseInt(p.getAttribute('data-marker')) == parseInt(nextMarker));
    if (nextPageIndex < nextPages.length) {
        const nextPage = nextPages[nextPageIndex];
        const nextMarkerNum = nextPage.getAttribute('data-marker');
        const nextPageNum = nextPage.getAttribute('data-page');
        
        const navigationHTML = `
            <div style="text-align: center; padding: 20px; margin-top: 20px;">
                <span id="pageNumber">Fejezet ${nextMarkerNum} - Oldal ${nextPageNum}</span>
            </div>
        `;
        
        container.innerHTML = nextPage.innerHTML + navigationHTML;
        container.style.display = 'block';
        
        // Szinkronizálás: ugyanez a tartalom a "Page" divbe is
        const pageContainer = document.querySelector('.Page');
        pageContainer.innerHTML = nextPage.innerHTML + navigationHTML;
        pageContainer.style.display = 'block';
    }
}

document.querySelector('.main').addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.querySelector('.main').addEventListener('touchend', function(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (currentMarker !== null) {
            if (diffX > 0) {
                if (currentPage < 4) {
                    displayPage(currentMarker, currentPage + 1);
                } else if (currentMarker < 11) {
                    displayPage(parseInt(currentMarker) + 1, 0);
                }
            } else {
                if (currentPage > 0) {
                    displayPage(currentMarker, currentPage - 1);
                } else if (currentMarker > 1) {
                    displayPage(currentMarker - 1, 4);
                }
            }
        }
    }
});

document.addEventListener('click', function(e) {
    const mainDiv = document.querySelector('.main');
    const mainRect = mainDiv.getBoundingClientRect();
    const clickX = e.clientX - mainRect.left;
    const mainWidth = mainRect.width;
    
    if (e.target.closest('.main') && mainDiv.innerHTML.trim() !== '' && currentMarker !== null) {
        if (clickX > mainWidth / 2) {
            if (currentPage < 4) {
                displayPage(currentMarker, currentPage + 1);
            } else if (currentMarker < 10) {
                displayPage(parseInt(currentMarker) + 1, 0);
            }
        } else if (clickX < mainWidth / 2) {
            if (currentPage > 0) {
                displayPage(currentMarker, currentPage - 1);
            } else if (currentMarker > 1) {
                displayPage(currentMarker - 1, 4);
            }
        }
        e.stopPropagation();
    }
});

document.querySelectorAll('.marker').forEach((marker, index) => {
    marker.addEventListener('click', function(e) {
        document.querySelectorAll('.marker').forEach(m => m.classList.remove('active'));
        this.classList.add('active');
        
        if (index === 0) {
            const mainDiv = document.querySelector('.main');
            const pageContainer = document.querySelector('.Page');
            currentMarker = null;

            let gridHTML = '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 20px;">';

            for (let i = 1; i <= 10; i++) {
                const lastRowStyle = i === 10 ? 'grid-column: 2;' : '';

                gridHTML += `
                    <div class="grid-item"
                         style="padding: 20px; background: rgba(1, 20, 77, 0.3); text-align: center; cursor: pointer; border: 1px solid rgba(1, 20, 77, 0.6); transition: all 0.3s; ${lastRowStyle}"
                         onclick="document.querySelectorAll('.marker')[${i}].click();">
                        <h3>Fejezet ${i}</h3>
                    </div>
                `;
            }

            gridHTML += '</div>';

            mainDiv.innerHTML = gridHTML;
            pageContainer.style.display = 'none';
            
            document.querySelectorAll('.grid-item').forEach(item => {
                item.addEventListener('mouseenter', function() {
                    this.style.background = 'rgba(1, 20, 77, 0.6)';
                    this.style.transform = 'scale(1.05)';
                });

                item.addEventListener('mouseleave', function() {
                    this.style.background = 'rgba(1, 20, 77, 0.3)';
                    this.style.transform = 'scale(1)';
                });
            });
        } else {
            displayPage(index, 0);
        }
        
        e.stopPropagation();
    });
});

displayPage(1, 1);