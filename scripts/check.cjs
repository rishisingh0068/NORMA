const fs=require('fs'),assert=require('assert/strict');
const pages=fs.readdirSync('.').filter(f=>f.endsWith('.html'));let links=0;
for(const file of pages){const html=fs.readFileSync(file,'utf8');assert(!/https?:\/\/(?:www\.)?norma\.in/i.test(html),file+': reference URL remains');
for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){const url=match[1];if(/^[a-z]+:|^#/i.test(url))continue;const target=url.split(/[?#]/)[0];if(target){assert(fs.existsSync(target),file+': missing '+url);links++;}}
for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))JSON.parse(match[1]);}
console.log('Passed '+pages.length+' pages and '+links+' local links/assets; no reference website URLs.');
for (const file of pages) {
 const html=fs.readFileSync(file,'utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,file+': expected one h1');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,file+': duplicate IDs');
 const stack=[],voidTags=new Set('area base br col embed hr img input link meta param source track wbr'.split(' '));
 for(const match of html.matchAll(/<\/?([a-z][a-z0-9-]*)\b[^>]*>/gi)) { const tag=match[1].toLowerCase(); if(voidTags.has(tag)||match[0].endsWith('/>'))continue; if(match[0].startsWith('</'))assert.equal(stack.pop(),tag,file+': mismatched '+tag);else stack.push(tag); }
 assert.equal(stack.length,0,file+': unclosed tags');
 for(const match of html.matchAll(/href="([^"#]*)#([^"]+)"/g)){const target=match[1].split('?')[0]||file;assert(fs.readFileSync(target,'utf8').includes('id="'+match[2]+'"'),file+': missing fragment');}
 assert(!html.includes('norma-placeholder-mark.svg'),file+': old logo reference');
}
console.log('HTML structure, fragments and supplied logo checks passed.');
