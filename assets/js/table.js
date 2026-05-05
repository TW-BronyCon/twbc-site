const table = document.querySelector('.compare-table');

if (table) {
    const rows = [...table.querySelectorAll('tbody tr')];
    const heads = [...table.querySelectorAll('thead .tier-head')];
    const allCells = [...table.querySelectorAll('tbody td')];
    const allThs = [...table.querySelectorAll('th')];

    heads.forEach((head, index) => {
        const colNumber = index + 1;
        head.dataset.col = String(colNumber);

        const label = head.querySelector('.tier-label');
        if (label) {
            label.dataset.col = String(colNumber);
        }

        head.addEventListener('mouseenter', () => {
            clearActive();
            startHover();
            activateColumn(colNumber);
        });
    });

    function clearActive() {
        table.classList.remove('is-hovering');

        rows.forEach(row => row.classList.remove('active-row'));
        allCells.forEach(cell => cell.classList.remove('active-col'));
        allThs.forEach(th => th.classList.remove('active-col'));
    }

    function activateRow(row) {
        if (!row) return;

        rows.forEach(r => r.classList.remove('active-row'));
        row.classList.add('active-row');
    }

    function activateColumn(colNumber) {
        allCells.forEach(cell => {
            cell.classList.toggle(
                'active-col',
                cell.dataset.col === String(colNumber)
            );
        });

        heads.forEach(head => {
            head.classList.toggle(
                'active-col',
                head.dataset.col === String(colNumber)
            );
        });
    }

    function startHover() {
        table.classList.add('is-hovering');
    }

    allCells.forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            const row = cell.closest('tr');
            const colNumber = cell.dataset.col;

            clearActive();
            startHover();
            activateRow(row);
            activateColumn(colNumber);
        });
    });

    rows.forEach(row => {
        const feature = row.querySelector('.feature-name');
        if (!feature) return;

        feature.addEventListener('mouseenter', () => {
            clearActive();
            startHover();
            activateRow(row);
        });
    });

    table.addEventListener('mouseleave', clearActive);
}