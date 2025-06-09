// Data for Feature set 1
const featureSet1 = {
    names: [
        "Close relative had diabetes",
        "Age",
        "HbA1c",
        "BMI",
        "High blood pressure"
    ],
    values: [0, 56, 11.1, 26, 0]
};

// Data for Feature set 2
const featureSet2 = {
    names: [
        "Close relative had diabetes",
        "Age",
        "HbA1c",
        "Weight",
        "Height"
    ],
    values: [0, 56, 11.1, 75.5, 170.3]
};

// Matrix data (coefficients)
const matrixData = [
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0.36, -0.35],
    [0.1, 0.02, 0, 0.01, -0.01]
];

// Bias values
const biasValues = [0, -0.1, 0, 58, -0.3];

// Get formula tooltip element
const tooltip = document.getElementById('formulaTooltip');

// Function to create Feature set 1 display
function createFeatureSet1() {
    const container = document.getElementById('featureSet1');
    featureSet1.names.forEach((name, index) => {
        const row = document.createElement('div');
        row.className = 'feature-set-1-row';
        row.dataset.row = index;
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'feature-name';
        nameDiv.textContent = name;
        
        const valueDiv = document.createElement('div');
        valueDiv.className = 'feature-value';
        valueDiv.textContent = featureSet1.values[index];
        
        const equalsDiv = document.createElement('div');
        equalsDiv.className = 'equals';
        equalsDiv.textContent = '=';
        
        row.appendChild(nameDiv);
        row.appendChild(valueDiv);
        row.appendChild(equalsDiv);
        container.appendChild(row);

        // Add hover event listeners
        row.addEventListener('mouseenter', (e) => {
            highlightRow(index);
            showFormula(index, e);
        });
        row.addEventListener('mouseleave', () => {
            removeHighlight();
            hideFormula();
        });
        row.addEventListener('mousemove', (e) => updateFormulaPosition(e));
    });
}

// Function to create Feature set 2 display
function createFeatureSet2() {
    const container = document.getElementById('featureSet2');
    
    // Create names row
    const namesRow = document.createElement('div');
    namesRow.className = 'feature-set-2-names';
    
    // Create values row
    const valuesRow = document.createElement('div');
    valuesRow.className = 'feature-set-2-values';
    
    featureSet2.names.forEach((name, index) => {
        // Create and add name cell
        const nameDiv = document.createElement('div');
        nameDiv.className = 'feature-set-2-name';
        nameDiv.textContent = name;
        namesRow.appendChild(nameDiv);
        
        // Create and add value cell
        const valueDiv = document.createElement('div');
        valueDiv.className = `feature-set-2-item col-${index}`;
        valueDiv.dataset.column = index;
        valueDiv.textContent = featureSet2.values[index];
        valuesRow.appendChild(valueDiv);
    });
    
    container.appendChild(namesRow);
    container.appendChild(valuesRow);
}

// Function to create the matrix
function createMatrix() {
    const table = document.getElementById('matrix');
    matrixData.forEach((row, i) => {
        const tr = document.createElement('tr');
        tr.dataset.row = i;
        row.forEach((value, j) => {
            const td = document.createElement('td');
            if (value === 0) {
                td.style.backgroundColor = 'white';
            } else {
                td.className = `col-${j}`;
                td.textContent = value === 1 ? '×1' : `×${value}`;
            }
            tr.appendChild(td);
        });
        table.appendChild(tr);

        // Add hover event listeners
        tr.addEventListener('mouseenter', (e) => {
            highlightRow(i);
            showFormula(i, e);
        });
        tr.addEventListener('mouseleave', () => {
            removeHighlight();
            hideFormula();
        });
        tr.addEventListener('mousemove', (e) => updateFormulaPosition(e));
    });
}

// Function to create bias column
function createBiasColumn() {
    const container = document.getElementById('biasColumn');
    const plusContainer = document.getElementById('plusSigns');
    
    biasValues.forEach((value, index) => {
        // Create plus sign
        const plusDiv = document.createElement('div');
        plusDiv.className = 'plus-sign';
        plusDiv.textContent = '+';
        plusContainer.appendChild(plusDiv);
        
        // Create bias value
        const biasDiv = document.createElement('div');
        biasDiv.className = 'bias-cell';
        biasDiv.textContent = value;
        container.appendChild(biasDiv);
    });
}

// Function to get non-zero columns for a row
function getNonZeroColumns(rowIndex) {
    return matrixData[rowIndex].map((value, index) => value !== 0 ? index : -1).filter(index => index !== -1);
}

// Function to highlight a specific row
function highlightRow(rowIndex) {
    // Get all rows from both feature set 1 and matrix
    const featureSet1Rows = document.querySelectorAll('.feature-set-1-row');
    const matrixRows = document.querySelectorAll('.matrix tr');
    const biasElements = document.querySelectorAll('.bias-cell');
    const plusSigns = document.querySelectorAll('.plus-sign');
    const featureSet2Items = document.querySelectorAll('.feature-set-2-item');

    // Get non-zero columns for the current row
    const nonZeroColumns = getNonZeroColumns(rowIndex);

    // Add highlight to the selected row and mask others
    featureSet1Rows.forEach((row, index) => {
        if (index === rowIndex) {
            row.classList.add('highlight-row');
        } else {
            row.classList.add('masked-row');
        }
    });

    matrixRows.forEach((row, index) => {
        if (index === rowIndex) {
            row.classList.add('highlight-row');
        } else {
            row.classList.add('masked-row');
        }
    });

    // Apply masking to bias and plus signs
    biasElements.forEach((element, index) => {
        if (index === rowIndex) {
            element.classList.add('highlight-row');
        } else {
            element.classList.add('masked-row');
        }
    });

    plusSigns.forEach((element, index) => {
        if (index === rowIndex) {
            element.classList.add('highlight-row');
        } else {
            element.classList.add('masked-row');
        }
    });

    // Highlight feature set 2 items that correspond to non-zero matrix values
    featureSet2Items.forEach((item, index) => {
        if (nonZeroColumns.includes(index)) {
            item.classList.add('highlight-feature2');
        } else {
            item.classList.add('masked-feature2');
        }
    });
}

// Function to remove all highlights and masks
function removeHighlight() {
    document.querySelectorAll('.highlight-row').forEach(element => {
        element.classList.remove('highlight-row');
    });
    document.querySelectorAll('.masked-row').forEach(element => {
        element.classList.remove('masked-row');
    });
    document.querySelectorAll('.highlight-feature2').forEach(element => {
        element.classList.remove('highlight-feature2');
    });
    document.querySelectorAll('.masked-feature2').forEach(element => {
        element.classList.remove('masked-feature2');
    });
}

// Function to generate formula for a row
function generateFormula(rowIndex) {
    const feature1Value = featureSet1.values[rowIndex];
    const matrixRow = matrixData[rowIndex];
    const bias = biasValues[rowIndex];
    
    // Get non-zero terms
    const terms = matrixRow.map((coef, j) => {
        if (coef !== 0) {
            const feature2Value = featureSet2.values[j];
            return `${feature2Value}×${coef === 1 ? '1' : coef}`;
        }
        return null;
    }).filter(term => term !== null);

    // Build the formula
    let formula = `${feature1Value} ≈ `;
    if (terms.length > 0) {
        formula += terms.join(' + ');
    }
    
    // Add bias if it's not 0
    if (bias !== 0) {
        formula += ` + ${bias}`;
    }

    return formula;
}

// Function to show formula tooltip
function showFormula(rowIndex, event) {
    const formula = generateFormula(rowIndex);
    tooltip.textContent = formula;
    tooltip.style.display = 'block';
    updateFormulaPosition(event);
}

// Function to update formula tooltip position
function updateFormulaPosition(event) {
    if (tooltip.style.display === 'block') {
        tooltip.style.left = (event.pageX + 15) + 'px';
        tooltip.style.top = (event.pageY + 15) + 'px';
    }
}

// Function to hide formula tooltip
function hideFormula() {
    tooltip.style.display = 'none';
}

// Initialize the display
window.onload = function() {
    createFeatureSet1();
    createFeatureSet2();
    createMatrix();
    createBiasColumn();
}; 