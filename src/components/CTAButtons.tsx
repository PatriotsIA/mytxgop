import merchImage from "../../assets/Merch.jpg";
import patriotRewardsImage from "../../assets/PATRIOTREWARDS.jpg";
import piaTvImage from "../../assets/PIATV.jpg";
import patriotDispatchImage from "../../assets/PatriotDispatch.jpg";
import type { CountySite } from "../data/countyTypes";

const ctas = [
  ["Join Our Community", "communityUrl", patriotDispatchImage],
  ["Register to Vote", "registerToVote", piaTvImage],
  ["Partner with Us", "partnerWithUs", merchImage],
  ["Join Patriot Rewards", "patriotRewards", patriotRewardsImage],
] as const;

export function CTAButtons({ county }: { county: CountySite }) {
  return (
    <section className="cta-strip">
      <div className="container cta-grid">
        {ctas.map(([label, key, image]) => (
          <a key={label} className="cta-card" href={county.links[key]}>
            <img src={image} alt="" loading="lazy" />
            <span>{label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
