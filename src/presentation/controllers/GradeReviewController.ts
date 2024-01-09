import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  Request,
  Headers,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessResponseDTO } from 'application/dtos/SuccessResponseDTO';
import { GradeReviewUseCase } from 'application/usecases/GradeReviewUseCase';
import { GradeReview } from 'domain/models/GradeReview';
import { GradeReviewComment } from 'domain/models/GradeReviewComment';
import { RequestWithUser } from 'infrastructure/guards/JwtStrategy';
import { TeacherRoleGuard } from 'infrastructure/guards/TeacherRoleGuard';
import { SuccessInterceptor } from 'infrastructure/interceptor/success.interceptor';
import { CreateGradeReviewVM } from 'presentation/view-model/gradereviews/CreateGradeReviewVM';
import { GradeReviewCommentVM } from 'presentation/view-model/gradereviews/GradeReviewCommentVM';
import { GradeReviewVM } from 'presentation/view-model/gradereviews/GradeReviewVM';
import { ReviewVM } from 'presentation/view-model/gradereviews/ReviewVM';

@ApiBearerAuth()
@ApiTags('Grade Review')
@Controller('api/v1/grade-review')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(SuccessInterceptor)
export class GradeReviewController {
  constructor(private readonly gradeReviewUseCase: GradeReviewUseCase) {}

  @Post()
  @ApiOperation({
    summary: 'Student request review',
  })
  @ApiHeader({
    name: 'class-id',
    description: 'Class ID',
    required: true,
  })
  async studentRequestReview(
    @Headers('class-id') classId: number,
    @Request() req: RequestWithUser,
    @Body() requestReview: CreateGradeReviewVM,
  ) {
    const gradeReview = CreateGradeReviewVM.fromViewModel(requestReview);

    await this.gradeReviewUseCase.studentRequestReview(
      gradeReview,
      classId,
      req.user.userId,
    );

    return new SuccessResponseDTO({
      message: 'Student request review successfully',
      metadata: {},
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Get all grade review of teacher',
  })
  async getAllGradeReviewOfTeacher(@Request() req: RequestWithUser) {
    const gradeReviews = await this.gradeReviewUseCase.teacherViewGradeReview(
      req.user.userId,
    );

    return new SuccessResponseDTO({
      message: 'Get all grade review successfully',
      metadata: gradeReviews.map((gradeReview) => {
        return {
          classId: gradeReview.classId,
          className: gradeReview.className,
          gradeReviews: gradeReview.reviews.map((review: GradeReview) =>
            GradeReviewVM.toViewModel(review),
          ),
        };
      }),
    });
  }

  @Post('review')
  @ApiOperation({
    summary: 'Teacher review grade review',
  })
  @ApiHeader({
    name: 'class-id',
    description: 'Class ID',
    required: true,
  })
  @UseGuards(TeacherRoleGuard)
  async teacherReviewGradeReview(
    @Headers('class-id') classId: number,
    @Request() req: RequestWithUser,
    @Body() review: ReviewVM,
  ) {
    await this.gradeReviewUseCase.teacherReviewGradeReview(
      review,
      classId,
      req.user.userId,
    );

    return new SuccessResponseDTO({
      message: 'Teacher review grade review successfully',
      metadata: {},
    });
  }

  @Post('comment')
  @ApiOperation({
    summary: 'Teacher/Student comment in grade review',
  })
  async commentInGradeReview(
    @Body() comment: GradeReviewCommentVM,
    @Request() req: RequestWithUser,
  ) {
    await this.gradeReviewUseCase.commentInGradeReview(
      GradeReviewCommentVM.fromViewModel(comment),
      req.user.userId,
    );

    return new SuccessResponseDTO({
      message: 'Teacher/Student comment grade review successfully',
      metadata: {},
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get detail grade review',
  })
  async getDetailGradeReview(
    @Request() req: RequestWithUser,
    @Param('id') gradeReviewId: number,
  ) {
    const gradeReview = await this.gradeReviewUseCase.viewGradeReviewDetail(
      req.user.userId,
      gradeReviewId,
    );

    return new SuccessResponseDTO({
      message: 'Get detail grade review successfully',
      metadata: {
        gradeReview: GradeReviewVM.toViewModel(gradeReview.info),
        comments: gradeReview.comments.map((comment: GradeReviewComment) =>
          GradeReviewCommentVM.toViewModel(comment),
        ),
      },
    });
  }
}
