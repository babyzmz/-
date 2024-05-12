const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {

    let characters = []; // 初始化一个空数组以存放从主进程接收的角色数据
    let filteredCharacters = [];

    function selectRandomCharacter() {
        if (filteredCharacters.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredCharacters.length);
            const selectedCharacter = filteredCharacters[randomIndex];
    
            document.getElementById('character-name').textContent = selectedCharacter.name;
            document.getElementById('character-image').src = selectedCharacter.image_url;
            document.getElementById('character-info').textContent = `星级: ${selectedCharacter.star} | 元素属性: ${selectedCharacter.element} | 武器类型: ${selectedCharacter.weapon}`;
        } else {
            console.log("No characters data available.");
        }
    }
    
    function filterCharactersByStar(star) {
        console.log(`Filtering characters for star: ${star}`);
        if (star === "all") {
            filteredCharacters = characters;
        } else {
            filteredCharacters = characters.filter(character => character.star === star);
        }
        console.log(`Filtered characters: ${filteredCharacters.map(char => char.name).join(', ')}`);
        selectRandomCharacter(); // 显示随机角色
    }

    // Bind click events to each button
    document.querySelectorAll('.star-button').forEach(button => {
        button.addEventListener('click', function() {
            filterCharactersByStar(this.value);
        });
    });

    document.getElementById('randomize-button').addEventListener('click', selectRandomCharacter);
    
    ipcRenderer.on('characters', (event, newCharacters) => {
        characters = newCharacters;
        console.log(`Received characters: ${characters.length}`);
        filterCharactersByStar('all'); // 默认选择所有星级
    });
});
