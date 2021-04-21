import { GetStaticProps } from "next";
import { format, parseISO } from "date-fns";
import { api } from "../services/api";
import { ptBR } from "date-fns/locale";
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

type Episode = {
  duration: number;
  durationAsString: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  members: string;
  title: string;
  url: string;
  id: string;
}

type HomeProps = {
  episodes: Episode[];
}

export default function Home(props: HomeProps) {
  console.log(props.episodes);

  return <>
  {
    JSON.stringify(props.episodes)
  }
  </>;
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 12,
      _sort: "published_at",
      _order: "desc"
    }
  });

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      description: episode.description,
      member: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  });

  return {
    props: {
      episodes
    },
    revalidate: 36000
  };
}