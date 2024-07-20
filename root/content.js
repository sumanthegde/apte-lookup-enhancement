(function() {
    'use strict';

    // Add new row to the querytable
    const queryTable = document.querySelector('#querytable tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td style="font-size: smaller;"> Autocomplete:--></td>
        <td>
            <input type="text" name="swordext" id="swordext" size="30">
        </td>
    `;
    queryTable.insertBefore(newRow, queryTable.firstChild.nextSibling);

//    // Suggestions map
//    const suggestions = new Map([
//        ["गजवक्त्रः", "गजः"]
//    ]);

    // Create the suggestions box
    const suggestionBox = document.createElement('ul');
    suggestionBox.style.position = 'absolute';
    suggestionBox.style.border = '1px solid #ccc';
    suggestionBox.style.background = '#eee';
    suggestionBox.style.zIndex = '1000';
    suggestionBox.style.maxHeight = '150px';
    suggestionBox.style.overflowY = 'auto';
    suggestionBox.style.listStyleType = 'none';
    suggestionBox.style.padding = '0';
    suggestionBox.style.margin = '0';
    suggestionBox.style.textAlign = 'left';
    suggestionBox.style.display = 'none'; // Hide initially
    document.body.appendChild(suggestionBox);

    const swordextInput = document.getElementById('swordext');
    const swordInput = document.getElementById('sword');
    const searchButton = document.getElementById('searchbtn');
    let swordextValueOG = '';
    let currentIndex = -1; // To keep track of the current highlighted suggestion

    function anusvarafy(input) {
        const rules = [
            { regex: /ङ(?=्[कखगघ])/g, replacement: 'ं' },
            { regex: /ञ(?=्[चछजझ])/g, replacement: 'ं' },
            { regex: /ण(?=्[टठडढ])/g, replacement: 'ं' },
            { regex: /न(?=्[तथदध])/g, replacement: 'ं' },
            { regex: /म(?=्[पफबभ])/g, replacement: 'ं' }
        ];
    
        let output = input;
    
        rules.forEach(rule => {
            output = output.replace(rule.regex, rule.replacement);
        });
    
        // Remove the virama after replacement
        output = output.replace(/ं्/g, 'ं');
    
        return output;
    }

    function updateSuggestions() {
        const value = swordextInput.value;
        suggestionBox.innerHTML = ''; // Clear previous suggestions
        if (value === '') {
            suggestionBox.style.display = 'none';
            return;
        }

        // Filter suggestions based on input value
        const filteredSuggestions = Array.from(suggestions.keys()).filter(key => key.startsWith(anusvarafy(value))).slice(0, 6);;

        if (filteredSuggestions.length === 0) {
            suggestionBox.style.display = 'none';
            return;
        }

        // Populate suggestion box
        filteredSuggestions.forEach((suggestion, index) => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            li.style.padding = '2px';
            li.style.cursor = 'pointer';
            li.addEventListener('mouseover', () => {li.style.fontWeight = 'bold'; li.style.backgroundColor = '#fff'});
            li.addEventListener('mouseout', () => {li.style.fontWeight = 'normal'; li.style.backgroundColor = '#eee'});
            li.addEventListener('click', () => {
                swordextInput.value = suggestion;
                swordInput.value = suggestions.get(suggestion);
                suggestionBox.style.display = 'none';
                searchButton.click();
            });
            suggestionBox.appendChild(li);
        });

        // Reset currentIndex and highlight the first suggestion if any
        currentIndex = -1;

        // Position the suggestion box
        const rect = swordextInput.getBoundingClientRect();
        suggestionBox.style.top = `${rect.bottom + window.scrollY}px`;
        suggestionBox.style.left = `${rect.left + window.scrollX}px`;
        suggestionBox.style.width = `${rect.width}px`;
        suggestionBox.style.display = 'block';
    }

    swordextInput.addEventListener('input', () => {
        updateSuggestions();
        swordextValueOG = anusvarafy(swordextInput.value);
        swordInput.value = suggestions.get(swordextValueOG) || swordextValueOG;
    });

    // Handle keyboard navigation for the suggestion box
    swordextInput.addEventListener('keydown', (e) => {
        const items = suggestionBox.querySelectorAll('li');
        if (items.length === 0) return;

        if (e.key === 'ArrowDown') {
            // Move down in the suggestions list
            e.preventDefault();
            if (currentIndex >= 0){
                items[currentIndex].style.fontWeight = 'normal';
                items[currentIndex].style.backgroundColor = '#eee';
            }
            currentIndex++;
            if (currentIndex == items.length){
                currentIndex = -1;
                swordextInput.value = swordextValueOG;
                swordInput.value = swordextInput.value;
            } else {
                items[currentIndex].style.fontWeight = 'bold';
                items[currentIndex].style.backgroundColor = '#fff';
                swordextInput.value = items[currentIndex].textContent;
                swordInput.value = suggestions.get(swordextInput.value);
            }
        } else if (e.key === 'ArrowUp') {
            // Move up in the suggestions list
            e.preventDefault();
            if (currentIndex >= 0){
                items[currentIndex].style.fontWeight = 'normal';
                items[currentIndex].style.backgroundColor = '#eee';
            }
            currentIndex--;
            if (currentIndex == -2)
                currentIndex = items.length - 1;
            if (currentIndex == -1){
                swordextInput.value = swordextValueOG;
                swordInput.value = swordextInput.value;
            } else {
                items[currentIndex].style.fontWeight = 'bold';
                items[currentIndex].style.backgroundColor = '#fff';
                swordextInput.value = items[currentIndex].textContent;
                swordInput.value = suggestions.get(swordextInput.value);
            }
        } else if (e.key === 'Enter') {
            // Select the current suggestion
            e.preventDefault();
            searchButton.click();
            suggestionBox.style.display = 'none';
        } else if (e.key === 'Escape') {
            e.preventDefault();
            suggestionBox.style.display = 'none';
        }
    });

    // Hide the suggestion box if click outside of it
    document.addEventListener('click', (e) => {
        if (!suggestionBox.contains(e.target) && e.target !== swordextInput) {
            suggestionBox.style.display = 'none';
        }
    });

})();

