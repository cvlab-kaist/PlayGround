/* PlayGround — plain, progressively enhanced HTML. No remote scripts or analytics. */
(() => {
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const config = window.SITE_CONFIG || {};
  const results = window.RESULTS || {};
  let toastTimer;
  const notify = message => {
    const el=$('#toast'); el.textContent=message; el.hidden=false;
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.hidden=true,3500);
  };
  // User-supplied author order, URLs and dagger; never infer affiliations.
  if (Array.isArray(config.authors) && config.authors.length) {
    const authorList=$('#author-list'); authorList.replaceChildren();
    authorList.classList.add('author-list');
    config.authors.forEach((author, index) => {
      if (index % 4 === 0) {
        const row=document.createElement('span');row.className='author-row';authorList.append(row);
      }
      const item=document.createElement('span');item.className='author-entry';
      const name=(typeof author==='string'?author:author.name).replace(/ /g,'\u00a0');
      if (typeof author==='object' && author.url) {
        const a=document.createElement('a');a.href=author.url;a.textContent=name;
        a.target='_blank';a.rel='noopener noreferrer';item.append(a);
      } else item.textContent=name;
      if (typeof author==='object' && author.marker) {
        const marker=document.createElement('sup');marker.textContent=author.marker;item.append(marker);
      }
      authorList.lastElementChild.append(item);
    });
    const affiliations=$('#affiliation-list');
    affiliations.textContent=config.affiliations || '';
    affiliations.hidden=!config.affiliations;
    const notes=$('#author-notes');
    if (notes) { notes.textContent=config.authorNotes || ''; notes.hidden=!config.authorNotes; }
    const venue=$('#venue');
    if (venue) { venue.textContent=config.venue || ''; venue.hidden=!config.venue; }
    $('#author-meta').hidden=false;
  }
  const codeLink=$('#code-link');
  if (config.codeUrl) {
    codeLink.href=config.codeUrl; codeLink.target='_blank'; codeLink.rel='noopener';
    codeLink.removeAttribute('aria-disabled'); codeLink.removeAttribute('title');
    $('.coming-soon',codeLink)?.remove();
  } else {
    codeLink.addEventListener('click', e=>{e.preventDefault();notify('The code repository URL has not been supplied yet.');});
    codeLink.addEventListener('keydown', e=>{if(e.key==='Enter'){e.preventDefault();codeLink.click();}});
  }
  // The portable preview embeds the manuscript. The published folder uses a normal relative PDF URL.
  let paperBlobUrl=null;
  $$('.paper-link').forEach(link=>{
    const paperUrl=config.paperUrl && config.paperUrl!=='embedded' ? config.paperUrl : '';
    if(paperUrl){
      link.href=paperUrl; link.target='_blank'; link.rel='noopener';
      link.removeAttribute('aria-disabled'); link.removeAttribute('role'); link.removeAttribute('title');
      $('.coming-soon',link)?.remove();
    }
    link.addEventListener('keydown', e=>{if(e.key==='Enter'&&!link.href){e.preventDefault();link.click();}});
    link.addEventListener('click', e=>{
      const embedded=$('#embedded-paper');
      if(!embedded){
        if(!paperUrl){e.preventDefault();notify('The paper link will be added soon.');}
        return;
      }
      e.preventDefault();
      if(!paperBlobUrl){
        try {
          const binary=atob(embedded.textContent.trim());
          const bytes=new Uint8Array(binary.length);
          for(let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
          paperBlobUrl=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
        }catch(error){console.error(error);notify('Unable to open the embedded paper. Use the PDF in the source package.');return;}
      }
      const a=document.createElement('a');a.href=paperBlobUrl;a.target='_blank';a.rel='noopener';a.click();
    });
  });
  // Mobile navigation and active-section progress.
  const menuButton=$('.menu-toggle'), nav=$('#top-nav');
  menuButton.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));
  });
  $$('a[data-nav]').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');
  }));
  let scrollQueued=false;
  const sections=$$('[data-section]');
  function updateNavigation(){
    scrollQueued=false;
    const cut=window.innerHeight*.3;
    let current=sections[0]?.id;
    for(const s of sections) if(s.getBoundingClientRect().top<=cut) current=s.id;
    $$('[data-nav]').forEach(a=>{
      const active=a.dataset.nav===current;a.classList.toggle('active',active);
      if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');
    });
    const max=document.documentElement.scrollHeight-window.innerHeight;
    $('.scroll-progress').style.width=(max>0?Math.min(100,window.scrollY/max*100):0)+'%';
  }
  window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateNavigation);}},{passive:true});
  window.addEventListener('resize',updateNavigation);
  updateNavigation();
  // Explore the supplied pipeline. Bounds refer to the actual source PDF, not a generated architecture.
  const modules={
    overview:{description:'The accepted canvas and remaining elements define the input state for the following turn.'},
    retriever:{box:[4.7,37.8,26.5,7.5],color:'#ac7154',description:'Retrieve five structurally similar references once, before generation.',target:'retriever'},
    planner:{box:[.8,48.5,23,43],color:'#5777bd',description:'Form the current functional group and plan its composition from the rendered canvas.',target:'planner'},
    generator:{box:[25.6,48.5,23,43],color:'#318ba2',description:'Predict editable layout attributes and render multiple candidates for the same group.',target:'generator'},
    verifier:{box:[50.1,48.5,23,43],color:'#8b71be',description:'Accept a candidate or revise the instruction for regeneration, then update the state.',target:'verifier'}
  };
  $$('[data-module]').forEach(button=>button.addEventListener('click',()=>{
    const value=button.dataset.module,m=modules[value],highlight=$('#diagram-highlight');
    $$('[data-module]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    if(m.box){
      const [left,top,width,height]=m.box;
      Object.assign(highlight.style,{left:left+'%',top:top+'%',width:width+'%',height:height+'%',borderColor:m.color,boxShadow:'0 0 0 4px '+m.color+'15'});
      highlight.classList.add('visible');
    } else highlight.classList.remove('visible');
    const caption=$('#pipeline-caption');caption.textContent=m.description;
    if(m.target){const a=document.createElement('a');a.href='#'+m.target;a.textContent='Read more ↓';caption.append(a);}
  }));
  // Table 1: compute emphasis from the actual means, excluding ground truth.
  function renderResults(dataset){
    const rows=results[dataset];if(!rows) return;
    const scores=rows.filter(row=>row.method!=='GT').map(row=>[...row.mean,...row.rule]);
    const ranks=Array.from({length:8},(_,column)=>Array.from(new Set(scores.map(r=>r[column]))).sort((a,b)=>column<6?b-a:a-b));
    const tbody=$('#results-body');tbody.replaceChildren();
    rows.forEach(row=>{
      const tr=document.createElement('tr');
      tr.className=row.method==='PlayGround'?'ours':row.method==='GT'?'gt':'';
      const method=document.createElement('th');method.scope='row';method.className='method';
      method.textContent=row.method;
      if(row.method==='PlayGround'){const tag=document.createElement('span');tag.className='ours-badge';tag.textContent='OURS';method.append(tag);}
      if(row.method==='GT') method.title='Ground truth. Excluded from best/second-best rankings.';
      tr.append(method);
      [...row.mean,...row.rule].forEach((value,column)=>{
        const td=document.createElement('td'),mean=document.createElement('span');mean.className='mean';
        mean.textContent=value.toFixed(column<6?3:4);
        if(row.method!=='GT') {
          if(value===ranks[column][0]){mean.classList.add('best');mean.title='Best among the evaluated methods';}
          else if(value===ranks[column][1]){mean.classList.add('second');mean.title='Second best among the evaluated methods';}
        }
        td.append(mean);
        if(column<6){const std=document.createElement('span');std.className='std';std.textContent='± '+row.std[column].toFixed(3);td.append(std);}
        tr.append(td);
      });
      tbody.append(tr);
    });
    const label=dataset==='crello'?'Crello':'LICA (zero-shot)';
    $('#results-caption').textContent=label+' quantitative results from Table 1 of the supplied manuscript.';
    $('#dataset-panel').setAttribute('aria-labelledby','tab-'+dataset);
    $$('[data-dataset]').forEach(b=>{const selected=b.dataset.dataset===dataset;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;});
  }
  $$('[data-dataset]').forEach(button=>button.addEventListener('click',()=>renderResults(button.dataset.dataset)));
  $('#show-std').addEventListener('change',e=>$('#results-table').classList.toggle('hide-std',!e.target.checked));
  renderResults('crello');
  // Accessible qualitative gallery.
  $$('[data-qual]').forEach(button=>button.addEventListener('click',()=>{
    const value=button.dataset.qual;
    $$('[data-qual]').forEach(b=>{const active=b===button;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
    $$('.qual-panel').forEach(p=>p.hidden=p.id!=='qual-'+value);
    updateNavigation();
  }));
  $$('[role=tablist]').forEach(tablist=>tablist.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
    const tabs=$$('[role=tab]',tablist); const active=tabs.indexOf(document.activeElement);
    if(active<0)return;
    const index=e.key==='Home'?0:e.key==='End'?tabs.length-1:(active+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
    e.preventDefault();tabs[index].focus();tabs[index].click();
  }));
  // AgentRVOS-style white fullscreen viewer. The image itself also dismisses it.
  // Keep keyboard/focus support, scroll restoration and existing SVG/high-res assets.
  const modal=$('#lightbox'),zoomImage=$('#lightbox-image'),closeButton=$('#close-lightbox');
  let lastFocus=null,closeTimer=null,isClosing=false,previousPadding='',previousScroll=0;
  let inertStates=[];
  const reducedMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fitFigure(){
    if(!zoomImage.naturalWidth || modal.hidden)return;
    const width=modal.clientWidth*.9,height=modal.clientHeight*.9;
    const ratio=zoomImage.naturalWidth/zoomImage.naturalHeight;
    zoomImage.style.width=Math.min(width,height*ratio)+'px';
    zoomImage.style.height='auto';
  }
  function openFigure(source){
    if(!source)return;
    clearTimeout(closeTimer);isClosing=false;
    lastFocus=document.activeElement;previousScroll=window.scrollY;
    $('#lightbox-title').textContent=source.dataset.zoomTitle||source.alt||'Enlarged figure';
    zoomImage.alt=source.alt;zoomImage.removeAttribute('style');
    modal.classList.remove('is-active','is-loaded');modal.hidden=false;
    previousPadding=document.body.style.paddingRight;
    const scrollGap=window.innerWidth-document.documentElement.clientWidth;
    if(scrollGap>0)document.body.style.paddingRight=scrollGap+'px';
    document.body.classList.add('modal-open');
    inertStates=Array.from(document.body.children)
      .filter(el=>el!==modal && !['SCRIPT','STYLE'].includes(el.tagName))
      .map(el=>[el,el.inert]);
    inertStates.forEach(([el])=>el.inert=true);
    zoomImage.onload=()=>{fitFigure();modal.classList.add('is-loaded');};
    zoomImage.onerror=()=>{closeFigure();notify('The figure could not be opened. Please check the image asset.');};
    zoomImage.src=source.dataset.highres||source.currentSrc||source.src;
    if(zoomImage.complete&&zoomImage.naturalWidth){fitFigure();modal.classList.add('is-loaded');}
    // Flush the initial .95-scale/zero-opacity frame before the transition.
    void modal.offsetWidth;
    requestAnimationFrame(()=>modal.classList.add('is-active'));
    closeButton.focus({preventScroll:true});
  }
  function closeFigure(){
    if(modal.hidden||isClosing)return;
    isClosing=true;modal.classList.remove('is-active');
    closeTimer=setTimeout(()=>{
      modal.hidden=true;modal.classList.remove('is-loaded');
      zoomImage.onload=null;zoomImage.onerror=null;zoomImage.removeAttribute('src');
      document.body.classList.remove('modal-open');document.body.style.paddingRight=previousPadding;
      inertStates.forEach(([el,wasInert])=>el.inert=wasInert);inertStates=[];
      lastFocus?.focus({preventScroll:true});
      window.scrollTo({top:previousScroll,behavior:'instant'});
      isClosing=false;
    },reducedMotion()?0:400);
  }
  $$('.zoom-target').forEach(image=>{
    image.setAttribute('role','button');image.setAttribute('aria-haspopup','dialog');
    image.setAttribute('aria-label','Enlarge: '+image.alt);
    image.addEventListener('click',()=>openFigure(image));
    image.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();openFigure(image);}
    });
    if(image.dataset.highres){const preload=new Image();preload.src=image.dataset.highres;}
  });
  $$('[data-zoom-for]').forEach(button=>button.addEventListener('click',()=>
    openFigure(document.getElementById(button.dataset.zoomFor))));
  modal.addEventListener('click',closeFigure);
  document.addEventListener('keydown',e=>{
    if(modal.hidden)return;
    if(e.key==='Escape'){e.preventDefault();closeFigure();}
    if(e.key==='Tab'){e.preventDefault();closeButton.focus({preventScroll:true});}
  });
  window.addEventListener('resize',()=>{if(!modal.hidden)fitFigure();});
  // Clipboard works when hosted and falls back to the local-file-compatible selection API.
  async function copyText(text){
    if(navigator.clipboard&&window.isSecureContext){try{await navigator.clipboard.writeText(text);return true;}catch(_){} }
    const textarea=document.createElement('textarea');textarea.value=text;textarea.style.position='fixed';textarea.style.left='-10000px';document.body.append(textarea);textarea.select();
    const ok=document.execCommand('copy');textarea.remove();return ok;
  }
  $('#copy-citation').addEventListener('click',async()=>{
    const ok=await copyText($('#bibtex').innerText);
    const label=$('#copy-citation span');label.textContent=ok?'Copied!':'Select and copy';
    notify(ok?'Draft BibTeX copied. Add final publication information before publishing.':'Clipboard access was blocked. Select the citation text to copy it.');
    setTimeout(()=>label.textContent='Copy BibTeX',2000);
  });
  // On-device text editing for the portable draft. No server calls and no hidden saving.
  function setEditMode(enabled){
    document.body.classList.toggle('edit-mode',enabled);
    $$('[data-editable]').forEach(el=>{if(enabled)el.setAttribute('contenteditable','plaintext-only');else el.removeAttribute('contenteditable');});
    $('#edit-toggle').setAttribute('aria-pressed',String(enabled));
    $('#edit-toggle').textContent=enabled?'Editing text':'Edit text';
    $('#export-html').hidden=!enabled;$('#edit-done').hidden=!enabled;$('#editor-tip').hidden=!enabled;
  }
  $('#edit-toggle').addEventListener('click',()=>setEditMode(!document.body.classList.contains('edit-mode')));
  $('#edit-done').addEventListener('click',()=>setEditMode(false));
  $('#export-html').addEventListener('click',()=>{
    const clone=document.documentElement.cloneNode(true);
    const body=clone.querySelector('body');body.classList.remove('edit-mode','modal-open');
    clone.querySelectorAll('[contenteditable]').forEach(el=>el.removeAttribute('contenteditable'));
    ['lightbox','editor-tip','toast','export-html','edit-done'].forEach(id=>{const el=clone.querySelector('#'+id);if(el)el.hidden=true;});
    const toggle=clone.querySelector('#edit-toggle');toggle.setAttribute('aria-pressed','false');toggle.textContent='Edit text';
    clone.querySelector('#lightbox').classList.remove('is-active','is-loaded');
    clone.querySelectorAll('[inert]').forEach(el=>el.removeAttribute('inert'));
    clone.querySelector('#lightbox-image').removeAttribute('src');
    const blob=new Blob(['<!DOCTYPE html>\n'+clone.outerHTML],{type:'text/html;charset=utf-8'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='PlayGround_project_page_edited.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
    notify('Your edited HTML has been exported.');
  });
})();
