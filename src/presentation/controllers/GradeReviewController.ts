import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  Request,
  Headers,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SuccessResponseDTO } from 'application/dtos/SuccessResponseDTO';
import { GradeReviewUseCase } from 'application/usecases/GradeReviewUseCase';
import { RequestWithUser } from 'infrastructure/guards/JwtStrategy';
import { TeacherRoleGuard } from 'infrastructure/guards/TeacherRoleGuard';
import { SuccessInterceptor } from 'infrastructure/interceptor/success.interceptor';
import { CreateGradeReviewVM } from 'presentation/view-model/gradereviews/CreateGradeReviewVM';
import { GradeReviewVM } from 'presentation/view-model/gradereviews/GradeReviewVM';

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
  @ApiHeader({
    name: 'class-id',
    description: 'Class ID',
    required: true,
  })
  @UseGuards(TeacherRoleGuard)
  async getAllGradeReviewOfTeacher(
    @Headers('class-id') classId: number,
    @Request() req: RequestWithUser,
  ) {
    const gradeReviews = await this.gradeReviewUseCase.teacherViewGradeReview(
      classId,
      req.user.userId,
    );

    return new SuccessResponseDTO({
      message: 'Get all grade review successfully',
      metadata: {
        gradeReviews: gradeReviews.map((gradeReview) =>
          GradeReviewVM.toViewModel(gradeReview),
        ),
      },
    });
  }
}