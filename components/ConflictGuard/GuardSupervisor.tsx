import React from "react";
import PropTypes from "prop-types";

export const GuardRegistrationContext = React.createContext<(group: string | string[]) => {unregister: () => void; updateStatus: (b: boolean) => void}>(
    () => ({
        unregister: () => {},
        updateStatus: () => {},
    })
);

export const GuardGatekeeperContext = React.createContext<(props?: CanLeaveProps) => boolean>(
    () => true
);
export function useGuard() {
  return React.useContext(GuardGatekeeperContext);
}
interface GuardSupervisorProps {
    children: React.ReactNode;
}
interface CanLeaveProps {
    alertMessage?: string
    group?: string | string[]
    skipAlert?: boolean
}
interface Guard {
    id: string
    isDirty: boolean
    group: string | string[]
}
export default function GuardSupervisor({ children }: GuardSupervisorProps) {
  const guards = React.useRef<Guard[]>([]);
  const lastId = React.useRef(0);

  function hasDirtyConnectors(group?: string | string[]) {
    const checkIsDirty = (guard: Guard) => guard.isDirty;

    if (!group) {
      return guards.current.some(checkIsDirty);
    }

    const checkIsInGroup = (guard: Guard) => (Array.isArray(group) ? group.indexOf(guard.group as string) >= 0 : guard.group === group);

    return guards.current.filter(checkIsInGroup).some(checkIsDirty);
  }

  function generateId() {
    lastId.current++;
    return lastId.current.toString();
  }

  const registerGuardCallback = React.useCallback((group: string | string[]) => {
    const newId = generateId();

    const guard = {
      id: newId,
      isDirty: false,
      group,
    };

    guards.current.push(guard);

    return {
      unregister: () => {
        guards.current = guards.current.filter(otherGuard => otherGuard.id !== newId);
      },
      updateStatus: (isDirty: boolean) => {
        guard.isDirty = isDirty;
      },
    };
  }, []);

  const canLeaveCallback = React.useCallback<(props?: CanLeaveProps) => boolean>(
    ({ group } = {}) => {
      if (hasDirtyConnectors(group)) {
        // eslint-disable-next-line no-restricted-globals, no-alert
        return true;
      }
      return false;
    },
    []
  );

  return (
    <GuardRegistrationContext.Provider value={registerGuardCallback}>
      <GuardGatekeeperContext.Provider value={canLeaveCallback}>
        {React.Children.count(children) > 1 ? <>{children}</> : children}
      </GuardGatekeeperContext.Provider>
    </GuardRegistrationContext.Provider>
  );
}

GuardSupervisor.displayName = "Guard.Supervisor";