import AffiliateModel from "../models/Affiliate.js";

const AffilateCreate = async (req, res) => {
    try {
        const { StoreId } = req.query;
        const { CountryCode, Affiliate_id } = req.body;

        if (!CountryCode || !Affiliate_id) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const FindAffiliate = await AffiliateModel.findOne({ CountryCode });
        if (FindAffiliate) {
            await AffiliateModel.updateOne({ CountryCode }, { Affiliate_id, shop_id: StoreId });
            return res.status(200).json({ message: "Affiliate link updated", success: true });
        } else {
            const CreateAffiliate = new AffiliateModel({
                CountryCode,
                Affiliate_id,
                shop_id: StoreId
            });
            await CreateAffiliate.save();
            return res.status(200).json({ message: "Affiliate link created", success: true });
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        });
    }
}

export { AffilateCreate };
