import express from 'express';

const router = express.Router();

import * as incentiveCtrl from './incentive.controller';

router.route('/incentiveCalculation/:id?').post(incentiveCtrl.addData).get(incentiveCtrl.getData).delete(incentiveCtrl.delData);
router.route('/incentiveCalculation/:id').put(incentiveCtrl.updateData).patch(incentiveCtrl.patchData);
router.route('/').get(incentiveCtrl.getTargetAmt);
router.route('/weekly').get(incentiveCtrl.getWeeklyAmt);
router.route('/incentiveCron').get(incentiveCtrl.incentiveCron);

export default router;