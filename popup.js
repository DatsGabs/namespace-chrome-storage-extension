const toggleButton = document.querySelector("#toggle")
const box = document.querySelector('.box')

// Add class depending of if it's active or not
function handleToggleButton(active) {
    if (active) {
        box.classList.add('active')
    } else {
        box.classList.remove('active')
    }
}

;(async function () {
    let settings = {
        active: false
    }

    // Gets the current URL of the tab
    const url = await new Promise((res, rej) => {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            let url = tabs[0].url
            res(url)
        })
    })

    // Gets chrome storage with the namespace URL
    const synchedSettings = await new Promise((res, rej) => {
        chrome.storage.sync.get(`settings:${url}`, (results) => {
            res(Object.values(results)[0])
        })
    })

    // If synchedSettings were detected you set them as the settings and call the box class toggler
    if (synchedSettings) {
        settings = synchedSettings
        handleToggleButton(settings.active)
    }

    // When toggle gets pressed changes settings.value value and saves it to storage with namespace
    toggleButton.addEventListener("click", () => {
        settings = {
            active: !settings.active
        }
        chrome.storage.sync.set({ [`settings:${url}`]: settings }, function () {
            handleToggleButton(settings.active)
        })
    })
})()
