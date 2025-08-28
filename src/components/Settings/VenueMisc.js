import { useState } from 'react';
import { useFirestore } from 'react-redux-firebase';
import { Button, Col, Empty, message, Modal, Row, Space, Spin } from 'antd';
import {
  LoadingOutlined,
  DeleteOutlined,
  // FlagOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import emptyReviewsImg from '../../images/empty_reviews.svg';
import { useSelector } from 'react-redux';
import { parseReviews } from '../../utils/collectionParsers';
import './VenueMisc.less';

export default function VenueMisc({ venue }) {
  const [loading, setLoading] = useState(false);
  const firestore = useFirestore();
  const reviews = useSelector((state) => parseReviews(state.firestore.data.litnessData));

  const resetLitnessScore = () => {
    Modal.confirm({
      title: 'Do you want to reset the DineGo Score?',
      content: '* Updates will be made live to B2C DineGo app immediately',
      icon: null,
      okType: 'primary',
      className: 'delete-modal-confirm',
      cancelButtonProps: { type: 'text' },
      autoFocusButton: null,
      okText: 'Yes, reset',
      onOk: async () => {
        setLoading(true);
        await firestore.update(
          { collection: 'venues', doc: venue.uid },
          {
            totalRatings: 0,
            totalScore: 0,
          }
        );
        const snapshot = await firestore
          .collection('litnessData')
          .where('venueid', '==', venue.uid)
          .get();
        if (!snapshot.empty) {
          const batch = firestore.batch();
          snapshot.forEach((doc) => {
            batch.delete(doc.ref);
          });
          await batch.commit();
        }
        message.destroy();
        message.success('DineGo Score was reseted');
        setLoading(false);
        return Promise.resolve();
      },
    });
  };
  const deleteReview = (reviewId, isLit) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this review?',
      content: '* Updates will be made live to B2C DineGo app immediately',
      icon: null,
      okType: 'danger',
      className: 'delete-modal-confirm',
      cancelButtonProps: { type: 'primary' },
      centered: true,
      autoFocusButton: null,
      okText: 'Delete',
      onOk: async () => {
        setLoading(true);
        await firestore.delete({ collection: 'litnessData', doc: reviewId });
        let updateBody = {
          totalRatings: firestore.FieldValue.increment(-1),
        };
        if (isLit) {
          updateBody.totalScore = firestore.FieldValue.increment(-1);
        }
        await firestore.update({ collection: 'venues', doc: venue.uid }, updateBody);
        message.destroy();
        message.success('Review was deleted');
        setLoading(false);
        return Promise.resolve();
      },
    });
  };
  // const flagReview = (reviewId, flaggedReason) => {
  //   Modal.confirm({
  //     title: 'Are you sure you want to flag this review?',
  //     content: '* Updates will be made live to B2C DineGo app immediately',
  //     icon: null,
  //     okType: 'danger',
  //     className: 'delete-modal-confirm',
  //     cancelButtonProps: { type: 'primary' },
  //     centered: true,
  //     autoFocusButton: null,
  //     okText: 'Delete',
  //     onOk: async () => {
  //       await firestore.update(
  //         { collection: 'litnessData', doc: reviewId },
  //         { flagged: true, flaggedReason }
  //       );
  //       message.destroy();
  //       message.success('Review was flagged');
  //       return Promise.resolve();
  //     },
  //   });
  // };

  return (
    <Row gutter={[48, 24]}>
      <Col
        xs={24}
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'white' }}>Current Litness Score</h1>
          <div>
            <div>Hour MockLitness: {venue.mockLitness || '0 (no data)'}</div>
            <div>Total score: {venue.totalScore}</div>
            <div>Total revies: {venue.totalScore}</div>
          </div>
          <div style={{ paddingTop: 12 }}>
            <Button type="primary" size="small" onClick={resetLitnessScore}>
              Reset Litness Score
            </Button>
          </div>
        </div>
      </Col>
      <Col xs={24}>
        <h1 style={{ color: 'white', textAlign: 'center' }}>Reviews</h1>
        <Spin
          spinning={loading}
          indicator={<LoadingOutlined />}
        >
          <Row justify="center" style={{ padding: "12px 0px" }}>
            {reviews.length === 0 && (
              <Col xs={24}>
                <Empty description="You don't have reviews yet." image={emptyReviewsImg} />
              </Col>
            )}
            {reviews.map((x) => (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={6}
                key={x.name}
                style={{ border: '1px dashed gainsboro', borderRadius: 4 }}
              >
                <div style={{ padding: 8 }}>
                  <div>
                    <em>{moment.unix(x.date).format('LLL')}</em>
                  </div>
                  <div>
                    <b>Lit:</b> {x.isLit ? 'Is LIT!' : 'Not LIT'}
                  </div>
                  <div>
                    <b>COVID Precautions:</b>{' '}
                    {Array.isArray(x.covidPrecautions) && x.covidPrecautions.length > 0
                      ? x.covidPrecautions.join(' - ')
                      : 'Not answered'}
                  </div>
                  <div>
                    <b>Music:</b> {Array.isArray(x.music) ? x.music.join(' - ') : 'Not answered'}
                  </div>
                  <div>
                    <b>Comments:</b> {x.comments || 'No comments left'}
                  </div>
                  <div style={{ textAlign: 'center', paddingTop: 4 }}>
                    <Space align="center">
                      {/* <Button
                        ghost
                        type="danger"
                        size="small"
                        icon={<FlagOutlined />}
                        onClick={() => flagReview(x.reviewId)}
                      /> */}
                      <Button
                        type="danger"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => deleteReview(x.reviewId, x.isLit)}
                      />
                    </Space>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Spin>
      </Col>
    </Row>
  );
}
