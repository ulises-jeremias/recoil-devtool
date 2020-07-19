import { FC, useState, useEffect } from 'react';
import { RecoilState, useRecoilTransactionObserver_UNSTABLE } from 'recoil';
import defaultLogger from './logger';

export type Logger = (
  next: Function
) => ({ prevState, nextState }: { prevState: any; nextState: any }) => any;

export interface RecoilDevtoolsProps {
  values?: RecoilState<any>[];
  logger?: Logger;
}

const RecoilDevtools: FC<RecoilDevtoolsProps> = ({
  values,
  logger = defaultLogger,
}) => {
  const [state, setState] = useState({ prevState: {}, nextState: {} });
  const [log, setLog] = useState(false);

  useRecoilTransactionObserver_UNSTABLE(async ({ previousSnapshot, snapshot }) => {
    values?.forEach(async (value) => {
      const previousValue = await previousSnapshot.getPromise(value);
      const nextValue = await snapshot.getPromise(value);

      setState(({ prevState, nextState }) => ({
        prevState: {
          ...prevState,
          [value.key]: previousValue,
        },
        nextState: {
          ...nextState,
          [value.key]: nextValue,
        }
      }));
    });

    setLog(true);
  });

  useEffect(() => {
    logger(() => null)({ ...state, action: { description: 'change' } });
  }, [state]);

  return null;
};

export default RecoilDevtools;
