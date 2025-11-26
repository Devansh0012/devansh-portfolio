'use client';

import * as React from 'react';
import {
  LayoutGroup,
  motion,
  useAnimate,
  delay,
  type Transition,
  type AnimationSequence,
} from 'motion/react';

interface LetterRadialIntroProps {
  letters: string[];
  stageSize?: number;
  letterSize?: number;
}

const transition: Transition = {
  delay: 0,
  stiffness: 300,
  damping: 35,
  type: 'spring',
  restSpeed: 0.01,
  restDelta: 0.01,
};

const spinConfig = {
  duration: 30,
  ease: 'linear' as const,
  repeat: Infinity,
};

const qsa = (root: Element, sel: string) =>
  Array.from(root.querySelectorAll(sel));

const angleOf = (el: Element) => Number((el as HTMLElement).dataset.angle || 0);

const armOfLetter = (letter: Element) =>
  (letter as HTMLElement).closest('[data-arm]') as HTMLElement | null;

export function LetterRadialIntro({
  letters,
  stageSize = 320,
  letterSize = 60,
}: LetterRadialIntroProps) {
  const step = 360 / letters.length;
  const [scope, animate] = useAnimate();

  React.useEffect(() => {
    const root = scope.current;
    if (!root) return;

    // get arm and letter elements
    const arms = qsa(root, '[data-arm]');
    const letterElements = qsa(root, '[data-arm-letter]');
    const stops: Array<() => void> = [];

    // letter lift-in
    delay(() => animate(letterElements, { top: 0 }, transition), 250);

    // build sequence for orbit placement
    const orbitPlacementSequence: AnimationSequence = [
      ...arms.map((el): [Element, Record<string, number>, Transition & { at: number }] => [
        el,
        { rotate: angleOf(el) },
        { ...transition, at: 0 },
      ]),
      ...letterElements.map((letter): [Element, Record<string, number>, Transition & { at: number }] => [
        letter,
        { rotate: -angleOf(armOfLetter(letter)!), opacity: 1 },
        { ...transition, at: 0 },
      ]),
    ];

    // play placement sequence
    delay(() => animate(orbitPlacementSequence), 700);

    // start continuous spin for arms and letters
    delay(() => {
      // arms spin clockwise
      arms.forEach((el) => {
        const angle = angleOf(el);
        const ctrl = animate(el, { rotate: [angle, angle + 360] }, spinConfig);
        stops.push(() => ctrl.cancel());
      });

      // letters counter-spin to stay upright
      letterElements.forEach((letter) => {
        const arm = armOfLetter(letter);
        const angle = arm ? angleOf(arm) : 0;
        const ctrl = animate(
          letter,
          { rotate: [-angle, -angle - 360] },
          spinConfig,
        );
        stops.push(() => ctrl.cancel());
      });
    }, 1300);

    return () => stops.forEach((stop) => stop());
  }, [animate, scope]);

  return (
    <LayoutGroup>
      <motion.div
        ref={scope}
        className="relative overflow-visible"
        style={{ width: stageSize, height: stageSize }}
        initial={false}
      >
        {letters.map((letter, i) => (
          <motion.div
            key={`${letter}-${i}`}
            data-arm
            className="will-change-transform absolute inset-0"
            style={{ zIndex: letters.length - i }}
            data-angle={i * step}
            layoutId={`arm-${letter}-${i}`}
          >
            <motion.div
              data-arm-letter
              className="absolute left-1/2 top-1/2 flex items-center justify-center -translate-x-1/2 rounded-full border-2 border-white/20 bg-white/5 backdrop-blur-sm"
              style={{
                width: letterSize,
                height: letterSize,
                opacity: i === 0 ? 1 : 0,
              }}
              layoutId={`arm-letter-${letter}-${i}`}
            >
              <span className="text-2xl font-bold text-white">{letter}</span>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </LayoutGroup>
  );
}
