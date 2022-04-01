
'use strict';
{
  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
    articleTag: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML)
  };

  const opts = {
    tagSizes: {
      count: 5,
      classPrefix: 'tag-size-',
    },
  };

  const select = {
    all: {
      articles: '.post',
      titles: '.post-title',
      linksTo: {
        tags: 'a[href^="#tag-"]',
        authors: 'a[href^="#author-"]',
      },
    },
    article: {
      tags: '.post-tags .list',
      author: '.post-author',
    },
    listOf: {
      titles: '.titles',
      tags: '.tags.list',
      authors: '.authors.list',
    },
  };

  const titleClickHandler = function (event) {
    event.preventDefault();
    const clickedElement = this;

    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
    clickedElement.classList.add('active');

    const activeArticles = document.querySelectorAll('.posts .post');

    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }
  
    const hrefAttribute = clickedElement.getAttribute('href');

   
    const correctArticle = document.querySelector(hrefAttribute);

    correctArticle.classList.add('active');

  };

  const tagClickHandler = function (event) {
    
    event.preventDefault();
    
    const clickedElement = this;
    
    const href = clickedElement.getAttribute('href');
    
    const tag = href.replace('#tag-', '');
    
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    
    for (let activeTagLink of activeTagLinks) {
      
      activeTagLink.classList.remove('active');
      
    }
    
    const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

   
    for (let tagLink of tagLinks) {

     
      tagLink.classList.add('active');
    }

    generateTitleLinks('[data-tags~="' + tag + '"]');
  };
  
  const authorClickHandler = function (event) {
    event.preventDefault();
    
    const clickedElement = this;
    
    const href = clickedElement.getAttribute('href');
    
    const author = href.replace('#author-', '');
    
    const activeAuthors = document.querySelectorAll(
      'a.active[href^="#author-"]'
    );
    
    for (let activeAuthor of activeAuthors) {
      activeAuthor.classList.remove('active');
    }
    
    const authorLinks = document.querySelectorAll(
      'a[href^="#author-' + href + '"]'
    );
    
    for (let authorLink of authorLinks) {
      authorLink.classList.add('active');
    }
    
    generateTitleLinks('[data-author="' + author + '"]');
  };

  const generateTitleLinks = function (customSelector = '') {
  
    const titleList = document.querySelector(select.listOf.titles);
    titleList.innerHTML = '';

   
    const articles = document.querySelectorAll(select.all.articles + customSelector);

    let html = '';

    for(let article of articles){
      
      const articleId = article.getAttribute('id');

     
      const articleTitle = article.querySelector(select.all.titles).innerHTML;

      
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);
      
      html = html + linkHTML;
    }

    titleList.innerHTML = html;
    const links = document.querySelectorAll('.titles a');
    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  };

  generateTitleLinks();

  const calculateTagsParams = function (tags) {
    const params = { max: 0, min: 999999 };
    for (let tag in tags) {
      console.log(tag + ' is used ' + tags[tag] + ' times');
      params.max = Math.max(tags[tag], params.max);
      params.min = Math.min(tags[tag], params.max);
    }
    return params;
  };

  const calculateTagClass = function (count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (opts.tagSizes.count - 1) + 1);
    return opts.tagSizes.classPrefix + classNumber;
  };

  const generateTags = function () {

  
    let allTags = {};
    
    const allArticles = document.querySelectorAll(select.all.articles);

    
    for (let article of allArticles) {

    
      const tagsWrapper = article.querySelector(select.article.tags);

  

      let html = '';
      const articleTags = article.getAttribute('data-tags');


      const articleTagsArray = articleTags.split(' ');

      for (let tag of articleTagsArray) {

        const linkHTMLData = {id: tag, tagName: tag};
        const linkHTML = templates.articleTag(linkHTMLData);

        html += linkHTML;


        if(!allTags[tag]) {

          allTags[tag] = 1;
        }else {
          allTags[tag]++;
        }
      
      }
      
      tagsWrapper.innerHTML = html;
      
    }

    
    const tagList = document.querySelector(select.listOf.tags);
    const tagsParams = calculateTagsParams(allTags);

    
    const allTagsData = {tags: []};

   
    for(let tag in allTags){
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    }
    
    console.log(allTagsData);
    tagList.innerHTML = templates.tagCloudLink(allTagsData);

  };
  generateTags();

  const addClickListenersToTags = function () {
    const allTagsLinks = document.querySelectorAll('a[href^="#tag-"]');
    for (let tagLink of allTagsLinks) {
      tagLink.addEventListener('click', tagClickHandler);
    }
  };

  addClickListenersToTags();

  const generateAuthors = function () {
    let allAuthors = {};
    const allArticles = document.querySelectorAll(select.all.articles);
    for (let article of allArticles) {
      const authorWrapper = article.querySelector(select.article.author);

      let html = '';
      const articleAuthor = article.getAttribute('data-author');

      const linkHTMLData = {id: articleAuthor, authorName: articleAuthor};
      const linkHTML = templates.articleAuthor(linkHTMLData);

      html += linkHTML;
      if (!allAuthors[articleAuthor]) {
        allAuthors[articleAuthor] = 1;
      } else {
        allAuthors[articleAuthor]++;
      }
      authorWrapper.innerHTML = html;
    }
    const authorList = document.querySelector(select.listOf.authors);
    let allAuthorsHTML = '';
    for (let author in allAuthors) {
      allAuthorsHTML +='<li><a href="#author-' +author +'"><span>' +author +' (' +allAuthors[author] +')</span></a></li> ';
     
    }
   
    authorList.innerHTML = allAuthorsHTML;
  };
  generateAuthors();


  const addClickListenersToAuthors = function () {
    
    const authorsLinks = document.querySelectorAll('.post-author a');
   
    for (let authorLink of authorsLinks) {
     
      authorLink.addEventListener('click', authorClickHandler);
    
    }
    
    const authorLinksList = document.querySelectorAll('.list.authors a');
   
    for (let authorLinkList of authorLinksList) {
      authorLinkList.addEventListener('click', authorClickHandler);
    }
  };

  addClickListenersToAuthors();

}
