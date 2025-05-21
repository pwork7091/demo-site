document.addEventListener('DOMContentLoaded', () => {
  const case1Btn = document.getElementById('case1-btn');
  const case2Btn = document.getElementById('case2-btn');
  const case3Btn = document.getElementById('case3-btn');
  const navList = document.getElementById('nav-list');
  const rightContent = document.getElementById('right-content');

  let currentCaseName = null;
  let currentNavItem = null;

  const topNavButtons = [case1Btn, case2Btn, case3Btn];

  // Helper function to update active states
  function updateActiveState(selectedElement, group, activeClass) {
    group.forEach(item => {
      if (item === selectedElement) {
        item.classList.add(activeClass);
      } else {
        item.classList.remove(activeClass);
      }
    });
  }

  // Function to load content into the right panel
  function loadContent(mainSectionKey, subSectionKey) {
    if (!currentCaseName || !siteData[currentCaseName]) return;

    const caseData = siteData[currentCaseName];
    if (!caseData[mainSectionKey] || typeof caseData[mainSectionKey][subSectionKey] === 'undefined') {
      rightContent.innerHTML = '<p>Content not found.</p>';
      return;
    }

    const content = caseData[mainSectionKey][subSectionKey];
    rightContent.innerHTML = content; // Handles HTML content correctly

    // Update active nav item
    // We need to find the li that corresponds to these keys
    const navItems = Array.from(navList.getElementsByTagName('li'));
    const activeLi = navItems.find(li =>
      li.dataset.mainSection === mainSectionKey && li.dataset.subSection === subSectionKey
    );
    if (activeLi) {
        updateActiveState(activeLi, navItems, 'active-nav-item');
        currentNavItem = activeLi;
    }
  }

  // Function to load a case study
  function loadCase(caseName) {
    if (!siteData || !siteData[caseName]) {
      console.error(`Data for ${caseName} not found.`);
      navList.innerHTML = '';
      rightContent.innerHTML = '<p>Please select a valid case study.</p>';
      return;
    }

    currentCaseName = caseName;
    const caseData = siteData[caseName];

    // Update active top button
    let activeBtn;
    if (caseName === "Case 1") activeBtn = case1Btn;
    else if (caseName === "Case 2") activeBtn = case2Btn;
    else if (caseName === "Case 3") activeBtn = case3Btn;
    if (activeBtn) {
        updateActiveState(activeBtn, topNavButtons, 'active-case-button');
    }

    // Populate left navigation
    navList.innerHTML = ''; // Clear previous items
    let firstNavItem = null;

    for (const mainSectionKey in caseData) {
      if (caseData.hasOwnProperty(mainSectionKey)) {
        const mainSection = caseData[mainSectionKey];
        
        // If mainSection is a string, it's a direct content item (like in Case 2)
        if (typeof mainSection === 'string') {
            const li = document.createElement('li');
            li.textContent = mainSectionKey; // Use mainSectionKey as title
            li.dataset.mainSection = mainSectionKey; // Special case: main section itself is the "sub-section"
            li.dataset.subSection = ''; // Indicate no further sub-key, content is directly under mainSectionKey
            navList.appendChild(li);
            if (!firstNavItem) {
                firstNavItem = li;
            }
        } else { // It's an object with sub-sections
            for (const subSectionKey in mainSection) {
                if (mainSection.hasOwnProperty(subSectionKey)) {
                    const li = document.createElement('li');
                    li.textContent = subSectionKey;
                    li.dataset.mainSection = mainSectionKey;
                    li.dataset.subSection = subSectionKey;
                    navList.appendChild(li);
                    if (!firstNavItem) {
                        firstNavItem = li;
                    }
                }
            }
        }
      }
    }

    // Load content for the first item in the nav list by default
    if (firstNavItem) {
      const mainSectionKey = firstNavItem.dataset.mainSection;
      const subSectionKey = firstNavItem.dataset.subSection;
      let contentToLoad = '<p>Content not found.</p>'; // Default if something goes wrong

      if (subSectionKey === '') { // Direct content item
        if (caseData && caseData[mainSectionKey]) {
          contentToLoad = caseData[mainSectionKey];
        }
      } else { // Item with sub-section
        if (caseData && caseData[mainSectionKey] && typeof caseData[mainSectionKey][subSectionKey] !== 'undefined') {
          contentToLoad = caseData[mainSectionKey][subSectionKey];
        }
      }
      rightContent.innerHTML = contentToLoad;

      updateActiveState(firstNavItem, Array.from(navList.getElementsByTagName('li')), 'active-nav-item');
      currentNavItem = firstNavItem;
    } else {
      rightContent.innerHTML = '<p>No items in this case study.</p>';
    }
  }
  
  // Event listener for left navigation list (event delegation)
  navList.addEventListener('click', (event) => {
    if (event.target && event.target.tagName === 'LI') {
      const li = event.target;
      const mainSection = li.dataset.mainSection;
      const subSection = li.dataset.subSection;

      if (subSection === '') { // Direct content from main section (Case 2 structure)
        const content = siteData[currentCaseName][mainSection];
        rightContent.innerHTML = content;
      } else { // Standard mainSection -> subSection structure
        const content = siteData[currentCaseName][mainSection][subSection];
        rightContent.innerHTML = content;
      }
      
      updateActiveState(li, Array.from(navList.getElementsByTagName('li')), 'active-nav-item');
      currentNavItem = li;
    }
  });

  // Event listeners for top navigation buttons
  case1Btn.addEventListener('click', () => loadCase("Case 1"));
  case2Btn.addEventListener('click', () => loadCase("Case 2"));
  case3Btn.addEventListener('click', () => loadCase("Case 3"));

  // Load "Case 1" by default
  loadCase("Case 1");
});
