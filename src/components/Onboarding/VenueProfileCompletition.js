import React, { useEffect, useState } from 'react';
import { Popover, Progress } from 'antd';
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import getVenueCompletition from '../../utils/venueCompletition';

export default function VenueProfileCompletition({ venue, width = 150 }) {
  const [onboarding, setOnboarding] = useState({
    progress: 0,
    details: [],
  });

  const handleOnboarding = (_venue) => {
    const _onboarding = getVenueCompletition(_venue);
    setOnboarding(_onboarding);
  };

  useEffect(() => {
    if (venue) {
      handleOnboarding(venue);
    }
  }, [venue]);

  return (
    <div style={{ width }}>
      <Popover
        placement="bottom"
        content={
          <ul style={{ paddingLeft: 12 }}>
            {onboarding.details.map((x) => (
              <li key={x.title}>
                <strong>{x.title}</strong>:{' '}
                {x.completed ? (
                  <CheckCircleTwoTone twoToneColor="#52c41a" />
                ) : (
                  <CloseCircleTwoTone twoToneColor="#eb2f96" />
                )}
              </li>
            ))}
          </ul>
        }
        title="Venue Profile Completition"
        trigger="click"
      >
        <Progress percent={Math.round((onboarding.progress / 7) * 100)} size="small" />
      </Popover>
    </div>
  );
}
