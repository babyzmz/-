const { app, BrowserWindow, ipcMain } = require('electron');
const axios = require('axios');
const cheerio = require('cheerio');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        title: "原神角色随机选择器",
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,  // 注意：为了示例简便，禁用了上下文隔离
            enableRemoteModule: true,
            webSecurity: false
        }
    });

    win.loadFile('index.html');

    // 加载完成后，获取角色数据并发送到渲染进程
    win.webContents.once('did-finish-load', () => {
        fetchCharacters()
            .then(characters => {
                win.webContents.send('characters', characters);
            })
            .catch(error => console.error(error));
    });
}

async function fetchCharacters() {
    const url = 'https://wiki.biligame.com/ys/角色';
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    let characters = [];
    $('.divsort.g').each((index, element) => {  // 移除了 .C5星 来选择所有星级
        const star = $(element).data('param1'); // 星级
        if (star === "5星" || star === "4星") { // 只选择4星和5星角色
            const name = $(element).find('.L').text().trim(); // 角色名称
            const elementAttr = $(element).data('param2'); // 元素属性
            const weapon = $(element).data('param3'); // 武器类型
            const image_url = $(element).find('.image img').attr('src'); // 图片URL

            characters.push({ name, star, element: elementAttr, weapon, image_url });
        }
    });

    return characters;
}


app.whenReady().then(createWindow);
