import Link from 'next/link';
import Filter from '@/components/shared/filter';
import LocalSearchbar from '@/components/shared/search/local-searchbar';
import { Button } from '@/components/ui/button';
import { HomePageFilters } from '@/constants/filters';
import HomeFilters from '@/components/home/home-filters';
import QuestionCard from '@/components/cards/question-card';
import NoResult from '@/components/shared/no-result';
import { getQuestions, getRecommendedQuestions } from '@/lib/actions/question.action';
import { SearchParamsProps } from '@/types';

import { auth } from '@clerk/nextjs';
import { Metadata } from 'next';
import { Pagination } from '@/components/ui/pagination';

export const metadata: Metadata = {
  title: 'Home | Dev Overflow',
  icons: {
    icon: '/assets/images/site-logo.svg',
  },
};

export default async function HomePage({ searchParams }: SearchParamsProps) {
  const { userId } = auth();

  let result;

  if (searchParams?.filter === 'recommended') {
    if (userId) {
      result = await getRecommendedQuestions({
        userId,
        searchQuery: searchParams.q,
        page: searchParams.page ? +searchParams.page : 1,
      });
    } else {
      result = {
        questions: [],
        isNext: false,
      };
    }
  } else {
    result = await getQuestions({
      searchQuery: searchParams.q,
      filter: searchParams.filter,
      page: searchParams.page ? +searchParams.page : 1,
    });
  }

  return (
    <>
      <div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='h1-bold text-dark100_light900'>All Questions</h1>

        <Link href='/ask-question' className='flex justify-end max-sm:w-full'>
          <Button className='primary-gradient min-h-[46px] px-4 py-3 !text-light-900'>
            Ask a Question
          </Button>
        </Link>
      </div>

      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearchbar
          route='/'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search for questions'
          otherClasses='flex-1'
        />

        <Filter
          filters={HomePageFilters}
          otherClasses='min-h-[46px] sm:min-w-[170px]'
          containerClasses='hidden max-md:flex'
        />
      </div>

      <HomeFilters />

      <div className='mt-10 flex w-full flex-col gap-6'>
        {result.questions.length > 0 ? (
          result.questions.map((question) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              title={question.title}
              tags={question.tags}
              author={question.author}
              upvotes={question.upvotes}
              views={question.views}
              answers={question.answers}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There's no questions to show"
            description='Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion.
          our query could be the next big thing others learn from. Get involved! 💡'
            link='/ask-question'
            linkText='Ask a Question'
          />
        )}
      </div>

      <div className='mt-10'>
        <Pagination></Pagination>
      </div>
    </>
  );
}
