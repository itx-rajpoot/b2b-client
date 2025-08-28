import { message, Switch } from 'antd'
import React, { useState } from 'react'
import { useFirestore } from 'react-redux-firebase';

export default function VenueVisibility({ hidden, venueId }) {
  const [loading, setLoading] = useState(false);
  const firestore = useFirestore();

  const toggleVisibility = (value) => {
    setLoading(true);
    firestore.update({ collection: 'venues', doc: venueId }, { 
      hidden: value,
    })
      .then(() => {
        setLoading(false);
        message.destroy();
        message.success(value ? 'Venue is now hidden from B2C App' : 'Venue is now visible on B2C App');
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        message.destroy();
        message.error('Oops! Something happened');
      });
  }

  return (
    <Switch
      loading={loading}
      checked={hidden}
      checkedChildren="Hidden on B2C" 
      unCheckedChildren="Visible on B2C" 
      onChange={toggleVisibility}
    />
  )
}
