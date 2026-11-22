'use strict';

const form      = document.getElementById('diagnostic');
const resetBtn  = document.getElementById('reset-btn');
const results   = document.getElementById('results');
const typeBox   = document.getElementById('result-type-box');
const etatBox   = document.getElementById('result-etat-box');
const typeText  = document.getElementById('result-type');
const etatText  = document.getElementById('result-etat');

/**
 * Lit l'état du formulaire : { nom_de_la_case: 1 (cochée) ou 0 }.
 * Le nom de chaque case est son attribut `name` dans index.html
 * (suffixe _med = zone médiane, _lat = zone latérale).
 */
function readCounts() {
  const counts = {};
  form.querySelectorAll('input[type="checkbox"]').forEach(({ name, checked }) => {
    counts[name] = checked ? 1 : 0;
  });
  return counts;
}

/**
 * Règles de diagnostic. Renvoie { types: [...], etat: '...' }.
 */
function diagnose(counts) {
  const {
    // Aspect visuel
    dilates_med, taches_med, terne_med, rougeurs_med,
    serres_med, rides_med, brillance_med, squames_med,
    dilates_lat, taches_lat, terne_lat, rougeurs_lat,
    serres_lat, rides_lat, brillance_lat, squames_lat,
    // Aspect palpatoire
    fine_med, lisse_med, granuleuse_med, epaisse_med, reche_med, veloutee_med,
    fine_lat, lisse_lat, granuleuse_lat, epaisse_lat, reche_lat, veloutee_lat,
    // Tonicité et autres observations
    tonicite_insuffisante, comedons, couperose, stries, atonie,
  } = counts;

  // Les deux zones combinées
  const dilates    = dilates_lat + dilates_med;
  const taches     = taches_lat + taches_med;
  const terne      = terne_lat + terne_med;
  const rougeurs   = rougeurs_lat + rougeurs_med;
  const serres     = serres_lat + serres_med;
  const rides      = rides_lat + rides_med;
  const brillance  = brillance_lat + brillance_med;
  const squames    = squames_lat + squames_med;

  const fine       = fine_lat + fine_med;
  const lisse      = lisse_lat + lisse_med;
  const granuleuse = granuleuse_lat + granuleuse_med;
  const epaisse    = epaisse_lat + epaisse_med;
  const reche      = reche_lat + reche_med;
  const veloutee   = veloutee_lat + veloutee_med;

  const types = [];
  let etat = '';

  // --- Type de peau ---
  if (!(dilates || taches || terne || rougeurs || rides || brillance || squames) &&
      !(fine || granuleuse || epaisse || reche) &&
      !comedons) {
    types.push('Peau normale');
  }

  if ((serres || squames) && !(dilates || brillance) &&
      reche && !(granuleuse || veloutee) &&
      !comedons) {
    types.push('Peau sèche');
  }

  if ((brillance || dilates) && !(serres || squames) &&
      (epaisse || granuleuse) && !(fine || lisse || reche || veloutee)) {
    types.push('Peau grasse');
  }

  // Mixte : zone médiane grasse ET zone latérale sans aucun signe
  const medianeGrasse =
    (brillance_med || dilates_med) && !(serres_med || squames_med) &&
    (epaisse_med || granuleuse_med) && !(fine_med || lisse_med || reche_med || veloutee_med);

  const lateraleNeutre =
    !(dilates_lat || taches_lat || terne_lat || rougeurs_lat || rides_lat || brillance_lat || squames_lat) &&
    !(fine_lat || granuleuse_lat || epaisse_lat || reche_lat) &&
    !comedons &&
    !(epaisse_lat || granuleuse_lat || brillance_lat || dilates_lat);

  if (medianeGrasse && lateraleNeutre) {
    types.push('Peau mixte');
  }

  // --- État de la peau (chaque règle écrase la précédente) ---
  if (stries) {
    etat = 'État déshydraté';
  }

  if (rougeurs || couperose) {
    etat = 'État sensible';
  }

  if (rides + taches + tonicite_insuffisante + atonie >= 2) {
    etat = 'État mature';
  }

  return { types, etat };
}

/** Affiche un résultat, ou un message neutre s'il est vide. */
function showResult(box, textEl, value, emptyMessage) {
  textEl.textContent = value || emptyMessage;
  box.classList.toggle('is-empty', !value);
}

function validate() {
  const { types, etat } = diagnose(readCounts());

  showResult(typeBox, typeText, types.join(' / '), 'Aucun type identifié');
  showResult(etatBox, etatText, etat, 'Aucun état identifié');

  results.hidden = false;
  results.classList.remove('is-stale');
  results.scrollIntoView({
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'nearest',
  });
}

function deselectAll() {
  form.reset();
  results.hidden = true;
  typeText.textContent = '';
  etatText.textContent = '';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  validate();
});

// Si une case change après validation, le résultat affiché n'est plus à jour
form.addEventListener('change', () => results.classList.add('is-stale'));

resetBtn.addEventListener('click', deselectAll);
