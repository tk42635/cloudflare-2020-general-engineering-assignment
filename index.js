//import { getAssetFromKV } from "@cloudflare/kv-asset-handler"
const Router = require('./router')
var links = [{ "name": "WSJ", "url": "https://www.wsj.com" }, { "name": "NY Times", "url": "https://www.nytimes.com" }, { "name": "CNN", "url": "https://www.cnn.com" }]
/**
 * Example of how router can be used in an application
 *  */
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

class DivTransformer {
    async element(element) {
        if (element.getAttribute('id') == 'links')
            for (var link of links)
                element.append('<a href="' + link.url + '">' + link.name + '</a>', { html: true })
        if (element.getAttribute('id') == 'profile')
            element.setAttribute('style', element.getAttribute('style').replace('display: none', ''))
        if (element.getAttribute('id') == 'social')
        {
            element.setAttribute('style', element.getAttribute('style').replace('display: none', ''))
            element.append('<a href="https://www.linkedin.com/in/derichuo/"><img src="https://simpleicons.org/icons/linkedin.svg"></a>', { html: true })
            element.append('<a href="https://github.com/tk42635"><img src="https://simpleicons.org/icons/github.svg"></a>', { html: true })
            element.append('<a href="https://www.facebook.com/deric.huo.5/"><svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Facebook icon</title><path d="M23.9981 11.9991C23.9981 5.37216 18.626 0 11.9991 0C5.37216 0 0 5.37216 0 11.9991C0 17.9882 4.38789 22.9522 10.1242 23.8524V15.4676H7.07758V11.9991H10.1242V9.35553C10.1242 6.34826 11.9156 4.68714 14.6564 4.68714C15.9692 4.68714 17.3424 4.92149 17.3424 4.92149V7.87439H15.8294C14.3388 7.87439 13.8739 8.79933 13.8739 9.74824V11.9991H17.2018L16.6698 15.4676H13.8739V23.8524C19.6103 22.9522 23.9981 17.9882 23.9981 11.9991Z"></path></svg></a>', { html: true })
        }
    }
}
class ImgTransformer {
    async element(element) {
        element.setAttribute('src', 'https://derichuo.com/author/de-huo/avatar_hubb69640ce5e7c355a63fc6b20efbb77b_769009_270x270_fill_q90_lanczos_center.jpg')
        element.setAttribute('width', '300px')
    }
}
class H1Transformer {
    async element(element) {
        element.append('dehuo')
    }    
}
class TitleTransformer {
    async text(text) {
        if (!text.lastInTextNode)
            text.replace('')
        else
            text.replace('De Huo')
    }    
}
class BodyTransformer {
    async element(element) {
        element.setAttribute('class', 'bg-blue-700')
    }    
}
const rewriter = new HTMLRewriter()
    .on("div", new DivTransformer())
    .on("img#avatar", new ImgTransformer())
    .on("h1#name", new H1Transformer())
    .on("title", new TitleTransformer())
    .on("body", new BodyTransformer())
    

function linkhandler(request) {
    const init = {
        headers: { 'content-type': 'application/json' },
    }
    const body = JSON.stringify({ data: links})
    return new Response(body, init)
}
async function htmlhandler(request) {
    const res = await fetch('https://static-links-page.signalnerve.workers.dev')
    const init = {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        }
      }
    return rewriter.transform(res)
}

async function handleRequest(request) {
    // return htmlhandler(request)
    const r = new Router()
    // Replace with the appropriate paths and handlers
    //r.get('.*/bar', () => new Response('responding for /bar'))
    r.get('/links', request => linkhandler(request))
    r.post('/links', request => linkhandler(request))
    r.get('/', request => htmlhandler(request)) // return the response from the origin
    r.post('/', request => htmlhandler(request))
    //r.get('/', () => new Response('Hello worker!')) // return a default message for the root route

    const resp = await r.route(request)
    return resp
}
