(async function() {
    const db = 'https://textdb.dev/api/data';
    const key = '7e9c4a24-3405-434f-aee7-f95259e145e7';
    const endpoint = `${db}/${key}`;

    // els
    const nameBox = document.querySelector('#name-box');
    const commentBox = document.querySelector('#sheev-comment-box');
    const submitBtn  = document.querySelector('#comment-submit-btn');
    const alertBox = document.querySelector('#alert');
    const quotes = document.querySelector('#quotes');

    // global state
    const state = { notes: [], alert: '' };

    // oninit
    const data = await getNotes();
    state.notes = data.notes;
    renderNotes(data.notes);

    /**
    * events
    **/
    submitBtn.addEventListener('click', async function(e) {
        e.preventDefault();

        if (nameBox.value.trim() !== '' && commentBox.value.trim() !== '') {
            const name = nameBox.value;
            const text = commentBox.value;
            state.alert = 'message recorded. sheev is grateful.'

            await addNote({ name, text });
            const data = await getNotes();

            state.notes = data.notes;
            renderNotes(data.notes);

            nameBox.value = '';
            commentBox.value = '';

            showAlert();
        }
    });

    /**
    * app funcs
    */
    function showAlert() {
        alertBox.innerText = state.alert;
        alertBox.classList.remove('display-none');
    }

    function renderNotes(notes) {
        quotes.innerHTML = createNotesHtml(notes);
    }

    function createNotesHtml(notes) {
        let html = '';

        for (let i = 0; i < notes.length; i++) {
            html += 
                `<blockquote class="p2 m2 italic border-left" cite="${notes[i].name}">` +
                    `<p>${ stripHtml(notes[i].text) }</p>` +
                    `<cite>~ <b>${ stripHtml(notes[i].name) }</b></cite>` +
                '</blockquote>'
            ;
        }

        return html;
    }

    async function getNotes() {
        try {
            const res = await get(endpoint);
            let body = await res.text();
            if (body === '' || !body) body = '{"notes":[]}';

            const data = JSON.parse(body);
            return data;
        } catch(e) {
            state.alert = 'Woops. Can\'t get notes. Try later.';
            console.error(`${state.alert} See error: \n ` + e);
        }
    }

    async function addNote({ name, text }) {
        try {
            // get notes first
            let data = await getNotes();

            // check if data is empty
            if (data === '' || !data) data = {};
            if (!data.notes) data.notes = [];

            // add new note
            data.notes.unshift({ name, text });

            // update data
            post(endpoint, data);
        } catch(e) {
            state.alert = 'Woops. Can\'t update notes. Try later.';
            console.error(`${state.alert} See error: \n ` + e);
        }
    }

    /**
    * utils
    **/
    function get(url, params = {}) {
        const query = Object.entries(params)
            .map(a => encodeURIComponent(a[0]) + '=' + encodeURIComponent(a[1]))
            .join('&')
        ;

        return fetch(url + '?' + query);
    }

    function post(url, data) {
        return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(data)
        });
    }

    function stripHtml(str) {
        const ele = document.createElement('template');
        ele.innerHTML = str;
        return ele.content.textContent || "";
    }
})();