(async function() {
    function get(url, params = {}) {
        const query = Object.entries(params)
            .map(a => encodeURIComponent(a[0]) + '=' + encodeURIComponent(a[1]))
            .join('&')
        ;

        return fetch(url + '?' + query);
    }

    let foo = await get('/.netlify/functions/notes');
    const json = await foo.json();
    console.log(json);
})();