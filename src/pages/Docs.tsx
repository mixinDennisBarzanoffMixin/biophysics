import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import katex from "katex";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Concept = {
  id: string;
  title: string;
  summary: string;
  equation?: string;
  details: string[];
  variables: { symbol: string; meaning: string; units?: string }[];
  links?: { label: string; url: string }[];
};

const concepts: Concept[] = [
  {
    id: "laminar-basics",
    title: "Laminar Flow Profile",
    summary: "Parabolic velocity profile.",
    equation: "v(r) = \\frac{\\Delta P}{4 \\mu L}\\left(R^2 - r^2\\right)",
    details: [
      "Centerline speed is highest; velocity goes to zero at the wall (no-slip).",
      "Shape depends on pressure gradient, viscosity, and pipe geometry.",
    ],
    variables: [
      { symbol: "v(r)", meaning: "Axial velocity at radius r", units: "m/s" },
      {
        symbol: "\\Delta P",
        meaning: "Pressure drop along length L",
        units: "Pa",
      },
      { symbol: "\\mu", meaning: "Dynamic viscosity", units: "Pa·s" },
      { symbol: "R", meaning: "Pipe radius", units: "m" },
      { symbol: "L", meaning: "Pipe length segment", units: "m" },
    ],
  },
  {
    id: "poiseuille",
    title: "Poiseuille Law (Volumetric Flow)",
    summary: "Relates volumetric flow to pressure drop",
    equation: "Q = \\frac{\\Delta P\\, \\pi R^{4}}{8 \\mu L}",
    details: [
      "Flow scales with the fourth power of radius — small radius changes dominate resistance.",
      "Assumes Newtonian fluid, steady laminar regime, and fully developed flow.",
    ],
    variables: [
      { symbol: "Q", meaning: "Volumetric flow rate", units: "m^3/s" },
      {
        symbol: "\\Delta P",
        meaning: "Pressure drop along length L",
        units: "Pa",
      },
      { symbol: "R", meaning: "Pipe radius", units: "m" },
      { symbol: "\\mu", meaning: "Dynamic viscosity", units: "Pa·s" },
      { symbol: "L", meaning: "Pipe length segment", units: "m" },
    ],
  },
  {
    id: "reynolds",
    title: "Reynolds Number",
    summary: "Dimensionless measure of inertia vs viscosity;",
    equation: "\\mathrm{Re} = \\frac{\\rho v D}{\\mu}",
    details: [
      "Laminar pipe flow typically persists for Re < 2{,}000; transitional region follows.",
      "Higher viscosity or smaller diameter reduces Re and favors laminar flow.",
    ],
    variables: [
      { symbol: "\\rho", meaning: "Fluid density", units: "kg/m^3" },
      { symbol: "v", meaning: "Characteristic velocity (avg)", units: "m/s" },
      { symbol: "D", meaning: "Hydraulic diameter (2R for pipes)", units: "m" },
      { symbol: "\\mu", meaning: "Dynamic viscosity", units: "Pa·s" },
    ],
  },
  {
    id: "womersley",
    title: "Pulsatile / Womersley Number",
    summary: "Captures unsteady inertia",
    equation: "\\alpha = R\\sqrt{\\frac{\\omega \\rho}{\\mu}}",
    details: [
      "Low \\alpha: velocity profile stays near-parabolic and in phase with pressure.",
      "High \\alpha: profile flattens, phase lag increases, inertial effects dominate.",
    ],
    variables: [
      { symbol: "R", meaning: "Tube radius", units: "m" },
      {
        symbol: "\\omega",
        meaning: "Angular frequency of oscillation",
        units: "rad/s",
      },
      { symbol: "\\rho", meaning: "Fluid density", units: "kg/m^3" },
      { symbol: "\\mu", meaning: "Dynamic viscosity", units: "Pa·s" },
    ],
  },
];

const Equation = ({ tex, block = false }: { tex: string; block?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      katex.render(tex, ref.current, {
        displayMode: block,
        throwOnError: false,
      });
    }
  }, [tex, block]);
  return (
    <div ref={ref} style={{ display: block ? "block" : "inline-block" }} />
  );
};

export function Docs({ onOpenSim }: { onOpenSim?: () => void }) {
  const [activeId, setActiveId] = useState<string>(concepts[0]?.id ?? "");
  const activeConcept = useMemo(
    () => concepts.find((c) => c.id === activeId) ?? concepts[0],
    [activeId],
  );

  return (
    <div className="docs-grid">
      <Card className="docs-nav">
        <CardHeader>
          <CardTitle>Concepts</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 p-4 pt-0">
          {concepts.map((concept) => (
            <Button
              key={concept.id}
              variant={concept.id === activeConcept.id ? "default" : "ghost"}
              className="w-full justify-start text-left h-auto py-2 px-3"
              onClick={() => setActiveId(concept.id)}
            >
              <div className="flex flex-col items-start gap-1">
                <div className="nav-title">{concept.title}</div>
                <div className="nav-sub">{concept.summary}</div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="docs-content">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-2xl">{activeConcept.title}</CardTitle>
            <p className="content-summary mt-2">{activeConcept.summary}</p>
          </div>
          {onOpenSim && (
            <Button onClick={onOpenSim} className="shrink-0">
              Open Laminar Flow Simulation
            </Button>
          )}
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          {activeConcept.equation && (
            <Card className="equation-card">
              <CardContent className="p-4">
                <Equation block tex={activeConcept.equation} />
              </CardContent>
            </Card>
          )}

          <Card className="details-card">
            <CardHeader>
              <CardTitle className="text-base">Key Points</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="details-list">
                {activeConcept.details.map((d, idx) => (
                  <li key={idx}>{d}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="variables-card">
            <CardHeader>
              <CardTitle className="text-base">Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="variables-grid">
                {activeConcept.variables.map((v) => (
                  <Card key={v.symbol} className="variable-row p-3">
                    <div className="flex items-center gap-3">
                      <Equation tex={v.symbol} />
                      <div className="variable-text">
                        <div className="var-meaning">{v.meaning}</div>
                        {v.units && <div className="var-units">{v.units}</div>}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
