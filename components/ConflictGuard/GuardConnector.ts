import React from "react";
import PropTypes from "prop-types";
import { GuardRegistrationContext } from "./GuardSupervisor";

interface GuardConnectorProps {
  isDirty: boolean,
  group: string,
};

const defaultProps = {
  isDirty: false,
  group: null,
};

export default function GuardConnector({ group, isDirty }: GuardConnectorProps) {
  const registerGuard = React.useContext(GuardRegistrationContext);
  const updateConnectorStatus = React.useRef<((b: boolean) => void) | null>(null);

  React.useEffect(() => {
    const { unregister, updateStatus } = registerGuard(group);

    updateConnectorStatus.current = updateStatus;

    return function cleanup() {
      updateConnectorStatus.current = null;
      unregister();
    };
  }, [group, registerGuard]);

  React.useEffect(() => {
    if (updateConnectorStatus.current) {
      updateConnectorStatus.current(isDirty);
    }
  }, [isDirty]);

  return null;
}

GuardConnector.displayName = "Guard.Connector";
GuardConnector.defaultProps = defaultProps;