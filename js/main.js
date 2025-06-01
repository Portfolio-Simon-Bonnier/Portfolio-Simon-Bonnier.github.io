"use strict";
import form from "./form.js";
import skillbar from "./skillbar.js";

document.addEventListener("DOMContentLoaded", () => {
  AOS.init({
    once: true,
  });
  form();
  skillbar();

  const nav = document.querySelector("#nav");
  const navBtn = document.querySelector("#nav-btn");
  const navBtnImg = document.querySelector("#nav-btn-img");

  //Hamburger menu
  navBtn.onclick = () => {
    if (nav.classList.toggle("open")) {
      navBtnImg.src = "img/icons/close.svg";
    } else {
      navBtnImg.src = "img/icons/open.svg";
    }
  };

  window.addEventListener("scroll", function () {
    const header = document.querySelector("#header");
    const hero = document.querySelector("#home");
    let triggerHeight = hero.offsetHeight - 170;

    if (window.scrollY > triggerHeight) {
      header.classList.add("header-sticky");
      goToTop.classList.add("reveal");
    } else {
      header.classList.remove("header-sticky");
      goToTop.classList.remove("reveal");
    }
  });

  let sections = document.querySelectorAll("section");
  let navLinks = document.querySelectorAll("header nav a");

  window.onscroll = () => {
    sections.forEach((sec) => {
      let top = window.scrollY;
      let offset = sec.offsetTop - 170;
      let height = sec.offsetHeight;
      let id = sec.getAttribute("id");

      if (top >= offset && top < offset + height) {
        navLinks.forEach((links) => {
          links.classList.remove("active");
          document
            .querySelector("header nav a[href*=" + id + "]")
            .classList.add("active");
        });
      }
    });
  };

  setupTimelineCompetences();
  setupFormationUEInteractive();
});

// Affichage des compétences au survol des expériences et du BUT
function setupTimelineCompetences() {
  document.querySelectorAll('.timeline-item').forEach(item => {
    const competences = item.getAttribute('data-competences');
    const compDiv = item.querySelector('.timeline-competences');
    if (competences && compDiv) {
      compDiv.innerHTML = '';
      competences.split(',').forEach(c => {
        const badge = document.createElement('span');
        badge.className = 'timeline-competence-badge';
        badge.textContent = c.trim();
        compDiv.appendChild(badge);
      });
      item.addEventListener('mouseenter', () => {
        item.classList.add('show-competences');
      });
      item.addEventListener('mouseleave', () => {
        item.classList.remove('show-competences');
      });
    }
  });
}

// Bloc interactif UE pour la formation
function setupFormationUEInteractive() {
  const formationItem = document.querySelector('.formation-interactive');
  if (!formationItem) return;
  const ueBlock = formationItem.querySelector('.formation-ue-block');
  const title = formationItem.querySelector('.formation-title');

  // Données UE, matières/projets, preuves
  const ueData = [
    {
      key: 'marketing',
      label: 'Marketing',
      colorClass: 'ue-marketing',
      branches: [
        { name: 'Étude de marché', proof: { text: 'Rapport PDF', url: 'img/CV Bonnier_Simon.pdf' } },
        { name: 'Projet marketing', proof: { text: 'Lien projet', url: 'https://exemple.com/projet-marketing' } },
      ]
    },
    {
      key: 'comm',
      label: 'Communication commerciale',
      colorClass: 'ue-comm',
      branches: [
        { name: 'Campagne pub', proof: { text: 'Présentation', url: 'https://exemple.com/presentation' } },
        { name: 'Projet vidéo', proof: { text: 'Vidéo', url: 'https://exemple.com/video' } },
      ]
    },
    {
      key: 'vente',
      label: 'Vente',
      colorClass: 'ue-vente',
      branches: [
        { name: 'Simulation de vente', proof: { text: 'Fiche éval', url: 'img/CV Bonnier_Simon.pdf' } },
        { name: 'Stage prospection', proof: { text: 'Rapport', url: 'https://exemple.com/rapport' } },
      ]
    },
    {
      key: 'parcours',
      label: 'Parcours',
      colorClass: 'ue-parcours',
      branches: [
        { name: 'Projet tuteuré', proof: { text: 'Dossier', url: 'https://exemple.com/dossier' } },
        { name: 'Mémoire', proof: { text: 'PDF', url: 'img/CV Bonnier_Simon.pdf' } },
      ]
    },
  ];

  let activeUE = 0;
  let activeBranch = null;

  function renderUEBlock() {
    ueBlock.innerHTML = '';
    // Bulles UE
    const bubbles = document.createElement('div');
    bubbles.className = 'formation-ue-bubbles';
    ueData.forEach((ue, idx) => {
      const bubble = document.createElement('div');
      bubble.className = `ue-bubble ${ue.colorClass}` + (activeUE === idx ? ' active' : '');
      bubble.textContent = ue.label;
      bubble.onclick = () => {
        activeUE = idx;
        activeBranch = null;
        renderUEBlock();
      };
      bubbles.appendChild(bubble);
    });
    ueBlock.appendChild(bubbles);
    // Arbre matières/projets
    const tree = document.createElement('div');
    tree.className = 'ue-tree';
    const branches = document.createElement('div');
    branches.className = 'ue-branches';
    ueData[activeUE].branches.forEach((branch, bidx) => {
      const branchDiv = document.createElement('div');
      branchDiv.className = 'ue-branch' + (activeBranch === bidx ? ' active' : '');
      branchDiv.textContent = branch.name;
      branchDiv.onclick = () => {
        activeBranch = bidx;
        renderUEBlock();
      };
      branches.appendChild(branchDiv);
    });
    tree.appendChild(branches);
    // Preuve
    if (activeBranch !== null) {
      const proof = ueData[activeUE].branches[activeBranch].proof;
      const proofDiv = document.createElement('div');
      proofDiv.className = 'ue-proof-link';
      proofDiv.innerHTML = `<a href="${proof.url}" target="_blank">${proof.text}</a>`;
      tree.appendChild(proofDiv);
    }
    ueBlock.appendChild(tree);
  }

  // Affichage/masquage du bloc interactif
  title.style.cursor = 'pointer';
  title.onclick = () => {
    if (ueBlock.style.display === 'block') {
      ueBlock.style.display = 'none';
    } else {
      ueBlock.style.display = 'block';
      renderUEBlock();
    }
  };
}
