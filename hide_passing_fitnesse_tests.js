// ==UserScript==
// @name           Hide Passing FitNesse Tests Content
// @description    Creates a link to hide all passing tests content
// @include        http://*fitnesseResult*.html*
// @include        file://*fitnesseResult*.html*
// @include        http://*FrontPage*?suite*
// ==/UserScript==
// Add jQuery
    var GM_JQ = document.createElement('script');
    GM_JQ.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.3.1/jquery.min.js';
    GM_JQ.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(GM_JQ);

// Check if jQuery's loaded
    function GM_wait() {
        if(typeof unsafeWindow.jQuery == 'undefined') { window.setTimeout(GM_wait,100); }
    	else { $ = unsafeWindow.jQuery; letsJQuery(); }
    }
    GM_wait();

// All your GM code must be inside this function
    function letsJQuery() {
		var passingTestElements = [];
		
		var findTestResultDivs = function() {
			var divs = new Array();
			// Does NOT work on older FitNesse Page Results?!
//			divs = divs.concat($(".alternating_row_1"));
//			divs = divs.concat($(".alternating_row_2"));			
			var elements = document.getElementsByTagName('div');
			for (var i=0;i<elements.length;i++){
				if (elements[i].className.indexOf('alternating_row') != -1) {
					divs = divs.concat([elements[i]]);	
				}
			}			
			return divs;
		}
		
		var getTestResult = function(element) {
			return $(element).find("span").get(0);
	    }
	
		var getTestResultLink = function(element) {
			return $(element).find("a").get(0);
	    }
		
		var isFailingTest = function(element) {
			return !contains(element.innerHTML, '0 wrong, 0 ignored, 0 exceptions'); 
		}
		
		var contains = function(text, doesContain) {
			return text != null && text.indexOf(doesContain) != -1;
	    }

		
		var findPassingTestsElements = function() {
		    var elements = findTestResultDivs();
		    for (var i=0;i<elements.length;i++) {
				var testResultElement = getTestResult(elements[i]);
				if (!isFailingTest(testResultElement)) {
					passingTestElements = passingTestElements.concat([elements[i]]);						
					findTestResultOutput(getTestResultLink(elements[i]).href);					
				}
		    }
	    }
	
		var findTestResultOutput = function(testResultLink) {
			// test result link
//			var testOutputLink = $('#'+testResultLink.split('#')[1])[0];
			var testOutputLink = document.getElementById(testResultLink.split('#')[1]);
			passingTestElements = passingTestElements.concat([testOutputLink.parentNode]);
			
			// test result output
			var children = $(testOutputLink.parentNode.parentNode).children();
			for (var i=0;i<children.length;i++) {
				if (children[i] == testOutputLink.parentNode) {
					passingTestElements = passingTestElements.concat([children[i+1]]);					
					break;
				}
			}
		}
		
		var hidePassingTestContent = document.createElement('a');
		hidePassingTestContent.setAttribute('href', 'javascript:void(0)');
		hidePassingTestContent.setAttribute('style', 'font-weight: bold; color:green; margin-left: 10px;');
	    hidePassingTestContent.innerHTML = "Hide/Show All Passing Tests";
	    hidePassingTestContent.addEventListener("click", function(){
		    	for (var i=0;i<passingTestElements.length;i++) {
					if ($(passingTestElements[i]).css('display') == 'none') {
						$(passingTestElements[i]).css('display', 'block');
					} else {
						$(passingTestElements[i]).css('display', 'none');						
					}
				}
		}, true);
		$('.header')[0].appendChild(hidePassingTestContent);
	    
		findPassingTestsElements();
    }