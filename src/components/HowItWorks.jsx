const steps = [
  ['01', 'Discover', 'Explore available surprise bags from local food spots.'],
  ['02', 'Reserve', 'Choose a bag and save your demo reservation.'],
  ['03', 'Pick up', 'Visit the listed pickup area during the collection window.']
];
export function HowItWorks() {
  return <section className="how-section" id="how-it-works" aria-labelledby="how-title"><div className="container how-layout">
    <div className="how-intro"><p className="eyebrow">THE SIMPLE IDEA</p><h2 id="how-title">A good find in<br /><em>three simple steps.</em></h2><p>Good food takes a short detour from the counter to your day.</p></div>
    <div className="steps">{steps.map(([number, title, description]) => <div className="step" key={number}><span className="step-number">{number}</span><div><h3>{title}</h3><p>{description}</p></div></div>)}</div>
  </div></section>;
}
