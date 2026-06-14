import {true_fetch} from "/dist/readyfetch.js"
async function send_to_back(data) {
    let response=true_fetch("/login/create", data, true, true)
}