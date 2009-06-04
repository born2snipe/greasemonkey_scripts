// ==UserScript==
// @name           Open Failing FitNesse Tests
// @description    Creates a link to open all failing tests and it makes a link to open each individual failing test
// @include        http://*fitnesseResult*.html*
// @include        file://*fitnesseResult*.html*
// @include        http://*FrontPage*?suite*
// ==/UserScript==

    function findFitNesseSuiteUrl() {
	    var elements = document.getElementsByTagName('a');
	    for (var i=0;i<elements.length;i++) {
		    if (elements[i].className == 'page_title') {
				return elements[i].href;    
		    }
	    }
	    return "";
    }
    
    function findBrokenTests(fitNesseServer) {
	    var testElements = new Array();
	    var elements = document.getElementsByTagName('div');
	    var x = 0;
	    for (var i=0;i<elements.length;i++) {
			if (isTestResultDiv(elements[i])) {
				var testResultElement = getTestResult(elements[i].childNodes);
				var testLink = getFitNesseTestLink(elements[i].childNodes);
				if (testResultElement != null && testLink != null) {
					if (isFailingTest(testResultElement)) {
						var url = fitNesseServer+"."+testLink.href.split('#')[1];
						testElements[x] = url;
						x++;
						addOpenTestLink(elements[i], url);						
					}
				}
			}
	    }
	    return testElements;
    }
    
    function addOpenTestLink(element, url) {
	    var openTestsAnchor = document.createElement('a');
		openTestsAnchor.setAttribute('href', 'javascript:void(0)');
		openTestsAnchor.setAttribute('style', 'font-weight:bold; color:red;');
    	openTestsAnchor.innerHTML = "Open";
    	openTestsAnchor.addEventListener("click", function(){
	    	window.open(url, '_blank');	
	   	}, true);
	   	element.appendChild(openTestsAnchor);
    }
    
    function isTestResultDiv(element) {
		return contains(element.className, 'alternating_row');
    }
    
    function getFitNesseTestLink(elements) {
	    for (var i=0;i<elements.length;i++) {
			if (isFitNesseTest(elements[i])) {
				return elements[i];	
			}
		}
		return null;
    }
    
    function isFitNesseTest(element) {
		if (element == null) return false;
		return contains(element.className, 'test_summary_link');   
    }
    
    function getTestResult(elements) {
	    for (var i=0;i<elements.length;i++) {
			if (isTestResult(elements[i])) {
				return elements[i];	
			}
		}
		return null;
    }
    
    function isFailingTest(element) {
	 	return !contains(element.innerHTML, '0 wrong, 0 ignored, 0 exceptions');   
    }
    
    function isTestResult(element) {
	   	var text = element.innerHTML;
	 	return contains(text, 'right') && contains(text, 'wrong') && contains(text, 'ignored');
    }
    
    function contains(text, doesContain) {
		return text != null && text.indexOf(doesContain) != -1;
    }
    
    function getElementsByClassName(classname, node) {	
		if(node == null)
			node = document.getElementsByTagName("body")[0];	
			
		var a = [];	
		var re = new RegExp('\\b' + classname + '\\b');	
		var els = node.getElementsByTagName("*");	
		
		for(var i=0,j=els.length; i<j; i++)	
			if(re.test(els[i].className))a.push(els[i]);	
				
		return a;	
	}
	
    var brokenTests = findBrokenTests(findFitNesseSuiteUrl());
 
       
    if (brokenTests.length > 0) {
		var openTestsAnchor = document.createElement('a');
		openTestsAnchor.setAttribute('href', 'javascript:void(0)');
		openTestsAnchor.setAttribute('id', 'openAllTests');
		openTestsAnchor.setAttribute('class', 'fail');
		openTestsAnchor.setAttribute('style', 'font-weight: bold; color:red; margin-left: 10px;');
    	openTestsAnchor.innerHTML = "Open All Failed Tests";
    	openTestsAnchor.addEventListener("click", function(){
	    	for (var i=0;i<brokenTests.length;i++) {
				window.open(brokenTests[i], '_blank');		
			}
		}, true);
		getElementsByClassName('header', null)[0].appendChild(openTestsAnchor);
    }

    